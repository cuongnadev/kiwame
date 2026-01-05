'use client'

import React, { useEffect, useState } from 'react';
import { ArrowDown, ChevronDown, SquarePlay, X } from 'lucide-react';

import { Video } from '@/types/video';
import { Button, CheckBox, Popup } from '@/app/components/ui';
import UploadForm from '@/app/studio/channel/[channel]/(main)/(content)/UploadForm';
import { VideoItem } from '@/app/components/common';
import { getMyVideos } from '@/app/actions/video.actions';

export default function UploadPage() {
  const [listVideo, setListVideo] = useState<Video[]>([])
  const [selectedVideos, setSelectedVideos] = useState<string[]>([])
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [formStatus, setFormStatus] = useState("upload")
  const [videoEdit, setVideoEdit] = useState<Video | null>(null)
  const [hoveredVideo, setHoveredVideo] = useState<string | null>(null)

  const hasSelection = selectedVideos.length > 0

  const fetchVideos = async () => {
    const data = await getMyVideos()
    setListVideo(data)
    console.log(data)
    setLoading(false)
  }
  useEffect(() => {
    fetchVideos()
  }, [])

  const toggleVideo = (id: string) => {
    setSelectedVideos((prev) => (prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]))
  }

  const toggleAll = () => {
    if (selectedVideos.length === listVideo.length) {
      setSelectedVideos([])
    } else {
      setSelectedVideos(listVideo.map((v) => v.id))
    }
  }

  const selectAll = () => {
    setSelectedVideos(listVideo.map((v) => v.id))
  }

  const clearSelection = () => {
    setSelectedVideos([])
  }

  const editVideo = (video_id: string) => {
    const video = listVideo.find(v => v.id === video_id)
    if (video) {
      setFormStatus("edit")
      setVideoEdit(video)
      setShowUploadModal(true)
    }
  }

  const deleteSelectedVideos = async () => {
    const res = await fetch('/api/upload/delete-video', {
      method: 'DELETE',
      body: (() => {
        const formData = new FormData();
        formData.append("listId", JSON.stringify(selectedVideos));
        return formData;
      })()
    })
    fetchVideos()
  }

  const deleteVideo = async (video_id: string) => {
    const res = await fetch('/api/upload/delete-video', {
      method: 'DELETE',
      body: (() => {
        const formData = new FormData();
        formData.append("listId", JSON.stringify([video_id]));
        return formData;
      })()
    })
    fetchVideos()
  }

  return (
    <div className='w-full h-full'>
      {listVideo.length > 0 && (
        <div className='absolute bottom-1 right-1 z-100'>
          <Button
            icon={<SquarePlay size={20} />}
            onClick={() => { setShowUploadModal(true) }}
            variant='outline'
            text='Tải video lên'
            radius='full'
          />
        </div>
      )}
      {hasSelection && (
        <div className="flex items-center gap-6 py-3 px-4 bg-white text-black mb-2">
          <span className="text-sm font-semibold">
            Đã chọn {selectedVideos.length} (
            <button onClick={selectAll} className="text-blue-600 underline cursor-pointer">
              Chọn tất cả
            </button>
            )
          </span>
          <Button
            text='Chỉnh sửa'
            icon={<ChevronDown className="w-4 h-4" />}
            iconPosition='right'
            variant='outline'
            className='text-black! hover:shadow hover:bg-neutral-200!'
          />
          <Button
            text='Thêm vào danh sách phát'
            icon={<ChevronDown className="w-4 h-4" />}
            iconPosition='right'
            variant='outline'
            className='text-black! hover:shadow hover:bg-neutral-200!'
          />
          <Popup
            trigger={
              <Button
                text='Thao tác khác'
                icon={<ChevronDown className="w-4 h-4" />}
                iconPosition='right'
                variant='outline'
                className='text-black! hover:shadow hover:bg-neutral-200!'
              />
            }
          >
            <div className=" w-40 flex flex-col items-center gap-2 p-2 rounded-xl cursor-pointer transition-all group">
              <Button
                text="Tải xuống"
                variant="outline"
                className="text-white/80 border-none text-xs group-hover:text-white transition-colors w-full justify-start"
                radius="sm"
                onClick={() => { }}
                disabled={selectedVideos.length > 1 || selectedVideos.length === 0}
              />
              <Button
                text="Xóa vĩnh viễn"
                variant="outline"
                className="text-white/80 border-none text-xs group-hover:text-white transition-colors w-full justify-start"
                radius="sm"
                onClick={() => deleteSelectedVideos()}
              />
            </div>
          </Popup>
          <Button
            icon={<X className="w-6 h-6" />}
            onClick={clearSelection}
            variant='outline'
            className='ml-auto! text-black! hover:shadow hover:bg-neutral-200! p-2!'
            radius='full'
          />
        </div>
      )}
      <div className="grid grid-cols-[48px_1fr_150px_100px_140px_80px_100px_120px] w-full items-center py-3 border-b font-semibold border-[#3f3f3f] text-[#aaa] text-sm">
        <CheckBox
          checked={selectedVideos.length === listVideo.length && listVideo.length > 0}
          onCheckedChange={toggleAll}
          all
        />
        <div className="flex items-center">
          <span>Video</span>
        </div>

        {/* Visibility */}
        <div className="text-center">Chế độ hiển thị</div>

        {/* Restriction */}
        <div className="text-center">Hạn chế</div>

        {/* Date */}
        <div className="flex items-center justify-center gap-1 text-white cursor-pointer">
          Ngày
          <ArrowDown className="w-4 h-4" />
        </div>

        {/* Views */}
        <div className="text-center">Lượt xem</div>

        {/* Comments */}
        <div className="text-center">Số bình luận</div>

        {/* Likes */}
        <div className="text-center">Lượt thích (%)</div>
      </div>

      {!loading && (
        listVideo.length > 0 ? (
          <>
            {listVideo.map((video) => (
              <VideoItem
                key={video.id}
                video={video}
                isSelected={selectedVideos.includes(video.id)}
                onSelect={() => toggleVideo(video.id)}
                editVideo={() => { editVideo(video.id) }}
                hoveredVideo={hoveredVideo}
                setHoveredVideo={setHoveredVideo}
                deleteVideo={deleteVideo}
              />
            ))}
          </>
        ) : (
          <div className='min-h-96 flex flex-col justify-center items-center'>
            <p className='p-2 text-neutral-500'>Không có nội dung</p>
            <Button
              text="Tải video lên"
              onClick={() => setShowUploadModal(true)}
              variant='primary'
              radius='full'
            />
          </div>
        )
      )}
      {showUploadModal && (
        <UploadForm video={videoEdit} onClose={() => { setShowUploadModal(false); setVideoEdit(null); fetchVideos() }} formStatus={formStatus} />
      )}
    </div>
  )
}

