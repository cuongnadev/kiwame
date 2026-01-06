import Image from "next/image"
import { BarChart2, Download, MessageSquare, MoreVertical, Pencil, Trash, Youtube } from "lucide-react";

import { Video } from "@/types/video";
import { Button, CheckBox, Popup } from "@/app/components/ui";
import { formatDuration } from "@/helper/formatDuration"

interface VideoItemProps {
    video: Video
    isSelected: boolean
    onSelect: () => void
    editVideo: () => void
    hoveredVideo: string | null
    setHoveredVideo: (id: string | null) => void
    deleteVideo: (id: string) => void
}

export function VideoUploadItem({
    video,
    isSelected,
    onSelect,
    editVideo,
    hoveredVideo,
    setHoveredVideo,
    deleteVideo
}: VideoItemProps) {

    const isDraft = video.isDraft

    return (
        <div className="grid relative grid-cols-[48px_1fr_120px_140px_120px_100px_100px_100px] py-3 border-b border-neutral-700 hover:bg-[#3f3f3f] transition-colors text-neutral-400 text-sm"
            onMouseEnter={() => setHoveredVideo(video.id)}
            onMouseLeave={() => setHoveredVideo(null)}
        >
            {/* Checkbox */}
            <CheckBox checked={isSelected} onCheckedChange={onSelect} />

            {/* Thumbnail + info */}
            <div className="flex gap-3">
                <div className="relative shrink-0">
                    <Image
                        src={video.thumbnail_url || "/default-thumbnail.png"}
                        alt={video.title}
                        width={80}
                        height={45}
                        className="w-32 h-16 object-cover rounded-lg"
                    />
                    {video.duration && (
                        <span className="absolute bottom-1 right-1 text-xs px-1.5 py-0.5 bg-black/70 rounded text-white">
                            {formatDuration(Number(video.duration))}
                        </span>
                    )}
                </div>

                <div className="flex flex-col gap-1 pt-1">
                    <span className="font-medium text-neutral-200 line-clamp-1">
                        {video.title}
                    </span>
                    {hoveredVideo === video.id ? (
                        <div className="flex items-center gap-4 text-[#aaa]">
                            <Button
                                title="Chỉnh sửa"
                                icon={<Pencil className="w-5 h-5" />}
                                variant="outline"
                                className="py-1! px-2! text-sm border-none"
                                onClick={editVideo}
                                radius="full"
                            />
                            {!isDraft && (
                                <>
                                    <Button
                                        icon={<BarChart2 className="w-5 h-5" />}
                                        variant="outline"
                                        className="py-1! px-2! text-sm border-none"
                                        onClick={() => { }}
                                        radius="full"
                                        title="Số liệu phân tích"
                                    />
                                    <Button
                                        icon={<MessageSquare className="w-5 h-5" />}
                                        variant="outline"
                                        className="py-1! px-2! text-sm border-none"
                                        onClick={() => { }}
                                        radius="full"
                                        title="Bình luận"
                                    />
                                </>
                            )}
                            <Button
                                icon={<Youtube className="w-5 h-5" />}
                                variant="outline"
                                className="py-1! px-2! text-sm border-none"
                                onClick={() => { }}
                                radius="full"
                                title="Xem trên YouTube"
                            />
                            <Popup
                                trigger={
                                    <Button
                                        icon={<MoreVertical className="w-5 h-5" />}
                                        variant="outline"
                                        className="py-1! px-2! text-sm border-none"
                                        onClick={() => { }}
                                        radius="full"
                                        title="Tuỳ chọn"
                                    />
                                }
                                className="min-w-40!"
                                position="bottom-left"
                            >
                                <div className=" w-40 flex flex-col items-center gap-2 p-2 rounded-xl cursor-pointer transition-all group">
                                    <Button
                                        text="Tải xuống"
                                        icon={<Download className="w-5 h-5 group-hover:text-white transition-colors" />}
                                        variant="outline"
                                        className="text-white/80 border-none text-xs group-hover:text-white transition-colors w-full justify-start"
                                        radius="sm"
                                        onClick={() => { }}
                                    />
                                    <Button
                                        text="Xóa vĩnh viễn"
                                        icon={<Trash className="w-5 h-5 group-hover:text-white transition-colors" />}
                                        variant="outline"
                                        className="text-white/80 border-none text-xs group-hover:text-white transition-colors w-full justify-start"
                                        radius="sm"
                                        onClick={() => deleteVideo(video.id)}
                                    />
                                </div>
                            </Popup>
                        </div>
                    ) : (
                        <span className="text-xs text-neutral-500 line-clamp-2">
                            {video.description || "Thêm mô tả cho video"}
                        </span>
                    )}
                </div>
            </div>

            {/* Visibility */}
            <div className="text-center pt-1 text-white font-semibold">
                {video.visibility === "public"
                    ? "Công khai"
                    : video.visibility === "private"
                        ? "Riêng tư"
                        : video.visibility === "unlisted"
                            ? "Không công khai"
                            : ""}
            </div>

            {/* For children */}
            <div className="text-center pt-1">
                {video.for_children ? "Dành cho trẻ em" : "Không"}
            </div>

            {/* Date / Draft action */}
            <div className="flex flex-col items-center text-center pt-1">
                <span className="text-white">{video.dateLabel}</span>
                <span className="text-xs text-neutral-300">Đã tải lên</span>
            </div>

            {/* Views */}
            <div className="text-center pt-1">
                {isDraft ? "" : video.views}
            </div>

            {/* Comments */}
            <div className="text-center pt-1">
                {isDraft ? "" : video.comments}
            </div>

            {/* Likes */}
            <div className="text-center pt-1">
                {isDraft ? "" : video.likes}
            </div>

            {
                isDraft && (
                    <div className="absolute right-4 top-1/5">
                        <Button
                            text="Chỉnh sửa bản nháp"
                            variant="outline"
                            className="py-2! px-3! text-sm"
                            onClick={editVideo}
                            radius="full"
                        />
                    </div>
                )
            }
        </div >
    )
}
