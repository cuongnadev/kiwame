import { useState, useRef, useEffect } from "react";
import UploadSelectedFile from "@/app/components/common/upload/UploadSelectedFile";
import UploadEditDetails from "@/app/components/common/upload/UploadEditDetail";

interface UploadFormProps {
  onClose: () => void,
  onFileSelected?: (file: File) => void
}

const CHUNK_SIZE = 5 * 1024 * 1024

export default function UploadForm({ onClose, onFileSelected }: UploadFormProps) {
  const [selectedVideoFile, setSelectedVideoFile] = useState<File | null>(null);
  const [selectedThumbnailFile, setSelectedThumbnailFile] = useState<File | null>(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState('upload');
  const [videoFileName, setVideoFileName] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const [forChildren, setForChildren] = useState<boolean | null>(null);
  const [privacy, setPrivacy] = useState('')
  const [uploadingVideo, setUploadingVideo] = useState(false);

  const uploadChunk = async (chunkFile: Blob, chunkIndex: number, totalChunks: number, uploadId: string) => {
    const form = new FormData();
    form.append("file", chunkFile, `chunk-${chunkIndex}.mp4`);
    form.append("upload_id", uploadId);
    form.append("chunk_index", chunkIndex.toString());
    form.append("total_chunks", totalChunks.toString());
    try {
      const response = await fetch('/api/upload/chunk', {
        method: 'POST',
        body: form
      });
      if (!response.ok) {
        throw new Error(`Chunk ${chunkIndex} uplpad failed`);
      }

      return await response.json()
    } catch (err) {
      console.error(`Chunk ${chunkIndex} upload failed:`, err);
      throw err;
    }
  }

  useEffect(() => {
    if (!selectedVideoFile) return;
    const upload = async () => {
      setUploadingVideo(true)
      const form = new FormData()
      form.append("title", selectedVideoFile.name)
      const upload_video_response = await fetch("/api/upload/video", {
        method: 'POST',
        body: form
      })
      const uploadVideoData = await upload_video_response.json()
      console.log(uploadVideoData)
      const video_id = uploadVideoData.video.id
      try {
        const uploadId = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
        const totalChunks = Math.ceil(selectedVideoFile.size / CHUNK_SIZE)
        const MERGE_SIZE = 10 * 1024 * 1024
        const chunksPerPart = Math.ceil(MERGE_SIZE / CHUNK_SIZE)
        for (let i = 0; i < totalChunks; i++) {
          const start = i * CHUNK_SIZE;
          const end = Math.min(start + CHUNK_SIZE, selectedVideoFile.size);
          const chunk = selectedVideoFile.slice(start, end);
          await uploadChunk(chunk, i, totalChunks, uploadId)
        }
        const mergeResponse = await fetch('/api/upload/merge-chunks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            upload_id: uploadId,
            total_chunks: totalChunks,
            file_name: selectedVideoFile.name,
            video_id: video_id,
          }),
        });

        if (!mergeResponse.ok) {
          throw new Error('Failed to merge chunks');
        }

        const mergeData = await mergeResponse.json();
        const filePath = mergeData.file_path;
        console.log('✓ Chunks merged successfully');
        const splitAndUploadResponse = await fetch('/api/upload/split-and-upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            video_id: video_id,
            file_path: filePath,
          }),
        });

        if (!splitAndUploadResponse.ok) {
          throw new Error('Failed to split and upload');
        }

        const data = await splitAndUploadResponse.json();
        console.log(data)

      } catch (err) {
        console.error('Upload failed:', err);
      } finally {
        setUploadingVideo(false)
      }
      setUploadingVideo(false)
    };

    upload();
  }, [selectedVideoFile])


  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true)
    } else if (e.type === "dragleave") {
      setIsDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragActive(false)

    const files = e.dataTransfer.files
    if (files && files[0]) {
      const file = files[0]
      if (file.type.startsWith("video/")) {
        setSelectedVideoFile(file)
        setVideoUrl(URL.createObjectURL(file))
        // onFileSelected(file)
        const fileName = file.name.replace(/\.[^/.]+$/, "");
        setTitle(fileName)
        setVideoFileName(fileName)
        setStatus('edit')
      }
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedVideoFile(e.target.files[0])
      setVideoUrl(URL.createObjectURL(e.target.files[0]))
      // onFileSelected(e.target.files[0])
      const fileName = e.target.files[0].name.replace(/\.[^/.]+$/, "");
      setTitle(fileName)
      setVideoFileName(fileName)
      setStatus('edit')
    }
  }

  const onSubmit = (type: string) => {
    if (type === "exit") {

    } else {

    }
  }
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-[0px] z-40">
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {status === 'upload' ? (
          <UploadSelectedFile
            handleDrag={handleDrag}
            handleDrop={handleDrop}
            handleChange={handleChange}
            fileInputRef={videoInputRef}
            isDragActive={isDragActive}
            onClose={onClose}
          />
        ) : (
          <UploadEditDetails
            onClose={onClose}
            videoUrl={videoUrl!}
            uploadingVideo={uploadingVideo}
            onSubmit={(type) => onSubmit(type)}
            videoFileName={videoFileName}
            title={title}
            description={description}
            privacy={privacy}
            forChildren={forChildren!}
            setTitle={(e) => setTitle(e)}
            setDescription={(e) => setDescription(e)}
            setPrivacy={setPrivacy}
            setForChildren={setForChildren}
            setThumbnailUrl={(url) => setThumbnailUrl(url)}
            setThumbnailFile={(file) => setSelectedThumbnailFile(file)}
          />
        )
        }
      </div >
    </div >
  )
}
