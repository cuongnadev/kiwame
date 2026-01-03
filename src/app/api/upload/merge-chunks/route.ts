import path from 'path';
import { existsSync } from 'fs';
import { NextResponse } from 'next/server';
import { mkdir, readFile, writeFile, unlink, rmdir } from 'fs/promises';

const TEMP_DIR = path.join(process.cwd(), 'public/temp-chunks');
const OUTPUT_DIR = path.join(process.cwd(), 'public/videos');

export const config = {
  maxDuration: 300, // 5 phút
};

export async function POST(req: Request) {
  try {
    const { upload_id, total_chunks, file_name, video_id } = await req.json();

    if (!upload_id || !total_chunks) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const uploadDir = path.join(TEMP_DIR, upload_id);

    // Kiểm tra folder chunks tồn tại
    if (!existsSync(uploadDir)) {
      return NextResponse.json(
        { error: 'Upload directory not found' },
        { status: 404 }
      );
    }

    // Tạo output directory
    if (!existsSync(OUTPUT_DIR)) {
      await mkdir(OUTPUT_DIR, { recursive: true });
    }

    console.log(`🔗 Merging ${total_chunks} chunks from ${uploadDir}...`);

    // Đọc tất cả chunks theo thứ tự
    const chunks: Buffer[] = [];

    for (let i = 0; i < total_chunks; i++) {
      const chunkPath = path.join(uploadDir, `chunk-${i}`);

      if (!existsSync(chunkPath)) {
        return NextResponse.json(
          { error: `Chunk ${i} not found` },
          { status: 400 }
        );
      }

      const chunkData = await readFile(chunkPath);
      chunks.push(chunkData);
      console.log(`✓ Chunk ${i + 1}/${total_chunks} read: ${(chunkData.length / (1024 * 1024)).toFixed(2)}MB`);
    }

    // Ghép tất cả chunks
    const mergedBuffer = Buffer.concat(chunks);
    const outputFileName = `${video_id}_${Date.now()}.mp4`;
    const outputPath = path.join(OUTPUT_DIR, outputFileName);

    await writeFile(outputPath, mergedBuffer);

    const finalSize = mergedBuffer.length;
    console.log(`✓ File merged: ${outputFileName} (${(finalSize / (1024 * 1024)).toFixed(2)}MB)`);

    // Xóa chunks folder
    try {
      for (let i = 0; i < total_chunks; i++) {
        const chunkPath = path.join(uploadDir, `chunk-${i}`);
        await unlink(chunkPath);
      }
      await rmdir(uploadDir);
      console.log('✓ Chunks folder deleted');
    } catch (e) {
      console.warn('⚠️ Failed to delete chunks folder:', e);
    }

    // Trả về thông tin file
    return NextResponse.json(
      {
        success: true,
        message: 'Chunks merged successfully',
        video_id,
        file_name: outputFileName,
        file_path: `videos/${outputFileName}`,
        file_size: finalSize,
        file_size_mb: (finalSize / (1024 * 1024)).toFixed(2),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Merge chunks error: ' + error);
    return NextResponse.json(
      { error: 'Merge chunks failed', details: String(error) },
      { status: 500 }
    );
  }
}
