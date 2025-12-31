import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import ffmpeg, { FfprobeData } from 'fluent-ffmpeg';
import ffmpegStatic from 'ffmpeg-static';
import ffprobeStatic from 'ffprobe-static';
import { createCloudinary } from '@/lib/cloudinary/cloudinary';
import { VideoItemService } from '@/services/video-item.service';
import { UploadApiErrorResponse, UploadApiResponse } from 'cloudinary';


if (ffmpegStatic) {
  ffmpeg.setFfmpegPath(
    path
      .join(process.cwd(), "node_modules", "ffmpeg-static", "ffmpeg.exe")
      .replace(/\\/g, "/")
  );

  console.log(
    "✓ FFmpeg path set:",
    path.join(process.cwd(), "node_modules", "ffmpeg-static", "ffmpeg.exe")
  );
}


if (ffprobeStatic.path) {
  ffmpeg.setFfprobePath(path
    .join(process.cwd(), "node_modules", "ffprobe-static", "bin", "win32", "x64", "ffprobe.exe")
    .replace(/\\/g, "/"));
  console.log('✓ FFprobe path set:', path
    .join(process.cwd(), "node_modules", "ffprobe-static", "bin", "win32", "x64", "ffprobe.exe"));
}

const cloudinary = createCloudinary();
const SPLITS_DIR = path.join(process.cwd(), 'public/video-splits');
const THUMBNAILS_DIR = path.join(process.cwd(), "public/thumbnails")
const TARGET_SIZE_MB = 90;
const TARGET_SIZE_BYTES = TARGET_SIZE_MB * 1024 * 1024;

// Lấy thời lượng video
function getVideoDuration(videoPath: string): Promise<number> {
  return new Promise((resolve, reject) => {
    console.log(`📊 Getting duration for: ${videoPath}`);

    ffmpeg.ffprobe(videoPath, (err: Error, metadata: FfprobeData) => {
      if (err) {
        console.error(`❌ FFprobe error:`, err.message);
        reject(new Error(`Failed to get video duration: ${err.message}`));
      } else {
        const duration = metadata?.format?.duration || 0;
        console.log(`✓ Duration: ${duration}s`);
        resolve(duration);
      }
    });
  });
}

// Lấy kích thước file
function getFileSize(filePath: string): number {
  return fs.statSync(filePath).size;
}


interface videoPart {
  filename: string,
  size: number,
  sizeInMB: string
}
// Cắt video thành 90MB
async function splitVideoBy90MB(
  videoPath: string,
  uploadId: string
): Promise<videoPart[]> {
  // Tạo folder splits
  if (!fs.existsSync(SPLITS_DIR)) {
    fs.mkdirSync(SPLITS_DIR, { recursive: true });
  }

  const uploadSplitDir = path.join(SPLITS_DIR, uploadId);
  if (!fs.existsSync(uploadSplitDir)) {
    fs.mkdirSync(uploadSplitDir, { recursive: true });
  }

  const fileSize = getFileSize(videoPath);
  const duration = await getVideoDuration(videoPath);

  // Tính số phần cần cắt
  const totalParts = Math.ceil(fileSize / TARGET_SIZE_BYTES);
  const durationPerPart = Math.ceil(duration / totalParts);

  console.log(`📹 Original video: ${(fileSize / (1024 * 1024)).toFixed(2)}MB`);
  console.log(`⏱️ Duration: ${Math.floor(duration)} seconds`);
  console.log(`✂️ Splitting into ${totalParts} parts (~90MB each)...`);

  const parts: { filename: string; size: number; sizeInMB: string }[] = [];

  // Cắt video
  for (let i = 0; i < totalParts; i++) {
    const startTime = i * durationPerPart;
    const filename = `part_${String(i + 1).padStart(3, '0')}.mp4`;
    const partPath = path.join(uploadSplitDir, filename);

    await new Promise<void>((resolve, reject) => {
      console.log(
        `✂️ Cutting part ${i + 1}/${totalParts} (${startTime}s - ${startTime + durationPerPart}s)...`
      );

      ffmpeg(videoPath)
        .setStartTime(startTime)
        .duration(durationPerPart)
        .videoCodec('copy')
        .audioCodec('copy')
        .output(partPath)
        .on('end', () => {
          const partSize = getFileSize(partPath);
          parts.push({
            filename,
            size: partSize,
            sizeInMB: (partSize / (1024 * 1024)).toFixed(2),
          });
          console.log(
            `✓ Part ${i + 1} created: ${filename} (${(partSize / (1024 * 1024)).toFixed(2)}MB)`
          );
          resolve();
        })
        .on('error', (error: Error) => {
          console.error(`Error cutting part ${i + 1}:`, error.message);
          reject(error);
        })
        .run();
    });
  }

  if(fs.existsSync(videoPath)){
    fs.unlinkSync(videoPath)
  }

  return parts;
}

interface UploadedPart {
  partIndex: number;
  publicId?: string;
  url?: string;
  secureUrl?: string;
  duration?: number;
  size?: number;
}

// Upload lên Cloudinary với stream
async function uploadToCloudinary(
  filePath: string,
  videoId: string,
  partIndex: number,
  totalParts: number
): Promise<UploadedPart> {
  return new Promise((resolve, reject) => {
    try {
      console.log(`☁️ Uploading part ${partIndex}/${totalParts} to Cloudinary...`);

      const uploadStream = cloudinary.uploader.upload_stream(
        {
          public_id: `videos/${videoId}/part_${String(partIndex).padStart(3, '0')}`,
          folder: `videos/${videoId}`,
          resource_type: 'video',
          chunk_size: 6000000, // 6MB chunks
        },
        (error: UploadApiErrorResponse| undefined, result: UploadApiResponse| undefined) => {
          if (error) {
            console.error(`Cloudinary upload error for part ${partIndex}:`, error);
            reject(error);
          } else {
            console.log(`✓ Part ${partIndex} uploaded to Cloudinary`);
            resolve({
              partIndex,
              publicId: result?.public_id,
              url: result?.url,
              secureUrl: result?.secure_url,
              duration: result?.duration,
              size: result?.bytes,
            });
          }
        }
      );

      // Pipe file vào upload stream
      const fileStream = fs.createReadStream(filePath);
      fileStream.pipe(uploadStream);

      fileStream.on('error', (error) => {
        console.error(`File stream error for part ${partIndex}:`, error);
        reject(error);
      });
    } catch (error) {
      console.error('Upload stream error:', error);
      reject(error);
    }
  });
}

export const config = {
  maxDuration: 900, // 15 phút
};

export async function POST(req: Request) {
  try {
    const { video_id, file_path } = await req.json();

    console.log('📨 Request received:', { video_id, file_path });

    if (!video_id || !file_path) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const fullVideoPath = path.join(process.cwd(), 'public', file_path);

    console.log('📁 Full path:', fullVideoPath);
    console.log('📁 File exists:', fs.existsSync(fullVideoPath));

    // Kiểm tra file tồn tại
    if (!fs.existsSync(fullVideoPath)) {
      console.error('❌ File not found at:', fullVideoPath);
      const videosDir = path.join(process.cwd(), 'public/videos');
      if (fs.existsSync(videosDir)) {
        const files = fs.readdirSync(videosDir);
        console.log('📂 Files in public/videos:', files);
      }
      return NextResponse.json(
        { error: 'Video file not found', path: fullVideoPath },
        { status: 404 }
      );
    }

    const uploadId = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

    // Bước 1: Cắt video
    console.log('Step 1: Splitting video into 90MB parts...');
    const parts = await splitVideoBy90MB(fullVideoPath, uploadId);

    // Bước 2: Upload lên Cloudinary
    console.log('Step 2: Uploading parts to Cloudinary...');
    const uploadedParts: UploadedPart[] = [];

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      const partPath = path.join(SPLITS_DIR, uploadId, part.filename);

      try {
        const uploadedPart = await uploadToCloudinary(
          partPath,
          video_id,
          i + 1,
          parts.length
        );

        const { error } = await VideoItemService.createVideoItem({
          video_id,
          part_index: uploadedPart.partIndex,
          cloud_url: uploadedPart.secureUrl,
          size_mb: parts[i].sizeInMB,
          duration: Math.round(uploadedPart.duration ?? 0),
        })

        if (error) {
          console.error(`❌ Failed to save part ${i + 1} to DB:`, error)
          throw new Error(`Failed to save part ${i + 1} to DB`)
        }
        uploadedParts.push(uploadedPart);
      } catch (error) {
        console.error(`Failed to upload part ${i + 1}:`, error);
        throw error;
      }
    }

    // Bước 3: Xóa local split files
    console.log('Step 3: Cleaning up local files...');
    try {
      for (const part of parts) {
        const partPath = path.join(SPLITS_DIR, uploadId, part.filename);
        if (fs.existsSync(partPath)) {
          fs.unlinkSync(partPath);
        }
      }
      const uploadSplitDir = path.join(SPLITS_DIR, uploadId);
      if (fs.existsSync(uploadSplitDir)) {
        fs.rmdirSync(uploadSplitDir);
      }
      console.log('✓ Local split files deleted');
    } catch (e) {
      console.warn('⚠️ Failed to delete local files:', e);
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Video split and uploaded successfully',
        video_id,
        uploadId,
        totalParts: parts.length,
        parts: uploadedParts.map((p, i) => ({
          partIndex: i + 1,
          totalParts: parts.length,
          size: parts[i].sizeInMB,
          cloudinaryUrl: p.secureUrl,
          cloudinaryPublicId: p.publicId,
          cloudinaryDuration: p.duration,
        })),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Split and upload error:', error);
    return NextResponse.json(
      {
        error: 'Split and upload failed',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
