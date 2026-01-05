import { useState, useRef, useEffect } from "react";
import UploadSelectedFile from "@/app/components/common/upload/UploadSelectedFile";
import UploadEditDetails from "@/app/components/common/upload/UploadEditDetail";
import { Video, VideoItemRow, VideoPart } from "@/types/video";

interface UploadFormProps {
  onClose: () => void,
  onFileSelected?: (file: File) => void,
  formStatus: string,
  video?: Video | null,
}

const CHUNK_SIZE = 5 * 1024 * 1024

export default function UploadForm({ onClose, formStatus, video}: UploadFormProps) {
  const [selectedVideoFile, setSelectedVideoFile] = useState<File | null>(null);
  const [selectedThumbnailFile, setSelectedThumbnailFile] = useState<File | null>(null);
  const [autoThumbnailFile, setAutoThumbnailFile] = useState<File | null>(null)
  const [isDragActive, setIsDragActive] = useState(false);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState(formStatus);
  const [videoFileName, setVideoFileName] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const [forChildren, setForChildren] = useState<boolean | null>(null);
  const [privacy, setPrivacy] = useState('')
  const [tags, setTags] = useState<string[]>([]);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [schedule, setSchedule] = useState();
  const [videoId, setVideoId] = useState<string | null>(null);
  const [parts, setParts] = useState<VideoPart[]>([]);

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

  const generateLocalThumbnail = (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
      const video = document.createElement("video")
      video.preload = "metadata"
      video.src = URL.createObjectURL(file)
      video.onloadedmetadata = () => {
        // Seek to 1 second or 10% of video
        video.currentTime = Math.min(1, video.duration * 0.1)
      }
      video.onseeked = () => {
        const canvas = document.createElement("canvas")
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        const ctx = canvas.getContext("2d")
        ctx?.drawImage(video, 0, 0, canvas.width, canvas.height)
        canvas.toBlob((blob) => {
          if (blob) {
            const thumbnailFile = new File([blob], "thumbnail.jpg", { type: "image/jpeg" })
            resolve(thumbnailFile)
          } else {
            reject(new Error("Canvas to Blob failed"))
          }
          URL.revokeObjectURL(video.src)
        }, "image/jpeg")
      }
      video.onerror = reject
    })
  }

  useEffect(() => {
    if (video && formStatus === 'edit') {
      setVideoId(video.id)
    }
  }, [video, formStatus])

  useEffect(() => {
    if (!selectedVideoFile) return;
    const upload = async () => {
      try {
        const localThumb = await generateLocalThumbnail(selectedVideoFile)
        setAutoThumbnailFile(localThumb)
        setThumbnailUrl(URL.createObjectURL(localThumb))
      } catch (err) {
        console.error("[v0] Local thumbnail generation failed:", err)
      }
      setUploadingVideo(true)
      const form = new FormData()
      form.append("title", selectedVideoFile.name.substring(0, selectedVideoFile.name.lastIndexOf('.')))
      const upload_video_response = await fetch("/api/upload/video", {
        method: 'POST',
        body: form
      })
      const uploadVideoData = await upload_video_response.json()
      console.log(uploadVideoData)
      const video_id = uploadVideoData.video.id
      setVideoId(video_id)
      setParts(uploadVideoData.video.parts || [])
      try {
        const uploadId = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
        const totalChunks = Math.ceil(selectedVideoFile.size / CHUNK_SIZE)
        // const MERGE_SIZE = 10 * 1024 * 1024
        // const chunksPerPart = Math.ceil(MERGE_SIZE / CHUNK_SIZE)
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

  useEffect(() => {
    if (formStatus === 'edit' && video) {
      setStatus('edit')
      setTitle(video.title)
      setDescription(video.description || '')
      setThumbnailUrl(video.thumbnail_url || null)
      setPrivacy(video.visibility || 'private')
      setForChildren(video.for_children ?? null)
      setVideoFileName(video.title)
      setTags(video.tags || [])
      const video_parts: VideoPart[] = video?.video_items
        ? video.video_items.map((item: VideoItemRow) => ({
          url: item.cloud_url,
          duration: item.duration,
        }))
        : [];
      setParts(video_parts);
    }
  }, [formStatus, video])



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
      onUpdateVideo("exit")
      onClose()
    } else {
      onUpdateVideo("save")
      onClose()
    }
  }

  const onUpdateVideo = async (status: string) => {
    try {
      let uploadedThumbnailUrl = thumbnailUrl || '';

      // Upload thumbnail TRƯỚC
      if (selectedThumbnailFile || autoThumbnailFile) {
        const thumbForm = new FormData();
        if (selectedThumbnailFile) {
          thumbForm.append("thumbnail", selectedThumbnailFile)
        } else if (autoThumbnailFile) {
          thumbForm.append("thumbnail", autoThumbnailFile)
        }

        const thumbRes = await fetch('/api/upload/thumbnail', {
          method: 'POST',
          body: thumbForm,
        });

        const thumbData = await thumbRes.json();
        uploadedThumbnailUrl = thumbData.thumbnail_url;

        // update state cho UI
        setThumbnailUrl(uploadedThumbnailUrl);
      }

      // Update video SAU
      const form = new FormData();
      form.append("id", videoId || '');
      form.append("title", title);
      form.append("description", description);
      form.append("tags", JSON.stringify(tags));
      form.append("visibility", privacy);
      form.append("for_children", forChildren ? 'true' : 'false');
      form.append("is_draft", status === 'save' ? 'false' : 'true');
      form.append("thumbnail_url", uploadedThumbnailUrl);

      const res = await fetch('/api/upload/update-video', {
        method: 'POST',
        body: form,
      });

      const data = await res.json();
      console.log(data);


    } catch (err) {
      console.error('Update video failed:', err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-[0px] z-100">
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
            formStatus={formStatus}
            parts={parts}
            onClose={onClose}
            thumbnailUrl={thumbnailUrl}
            videoUrl={videoUrl!}
            uploadingVideo={uploadingVideo}
            onSubmit={(type) => onSubmit(type)}
            videoFileName={videoFileName}
            title={title}
            description={description}
            privacy={privacy}
            forChildren={forChildren}
            tags={tags}
            setTitle={(e) => setTitle(e)}
            setDescription={(e) => setDescription(e)}
            setPrivacy={setPrivacy}
            setForChildren={setForChildren}
            setTags={setTags}
            setThumbnailUrl={(url) => setThumbnailUrl(url)}
            setThumbnailFile={(file) => setSelectedThumbnailFile(file)}
          />
        )
        }
      </div >
    </div >
  )
}
