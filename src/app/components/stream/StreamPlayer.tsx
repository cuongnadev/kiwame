"use client";

import clsx from "clsx";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { LiveKitRoom, RoomAudioRenderer } from "@livekit/components-react";
import { Flag, EyeOff, Eye, Info, Save, Radio, UploadCloud, PencilLine, PencilOff } from "lucide-react";

import { Stream } from "@/types/stream";
import { kiwameConfig } from "@/config/kiwame.config";
import { VideoView, StreamCleanup } from "@/app/components/stream";
import { Button, CopyButton, Input, Select, Textarea } from "@/app/components/ui";

export default function StreamPlayer({ initialStream }: { initialStream: Stream }) {
  const [viewCount] = useState(0);
  const [title, setTitle] = useState("Live stream");
  const [category, setCategory] = useState("Trò chơi");
  const [subCategory, setSubCategory] = useState(false);
  const [subTitles, setSubTitles] = useState(false);
  const [privacy, setPrivacy] = useState("Công khai");
  const [description, setDescription] = useState("");
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [delay, setDelay] = useState("Thấp");
  const [visible, setVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSave, setIsSave] = useState(false);
  const [saving, setSaving] = useState(false);

  const thumbnailRef = useRef<HTMLInputElement | null>(null);

  const handlePickThumbnail = () => thumbnailRef.current?.click();

  const handleFile = (
    file: File,
    setFile: React.Dispatch<React.SetStateAction<File | null>>,
    setPreview: React.Dispatch<React.SetStateAction<string | null>>
  ) => {
    setFile(file);
    setPreview(URL.createObjectURL(file));
    setIsSave(true);
  };

  const handleDrog = (
    e: React.DragEvent<HTMLDivElement>,
    setFile: React.Dispatch<React.SetStateAction<File | null>>,
    setPreview: React.Dispatch<React.SetStateAction<string | null>>
  ) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file, setFile, setPreview);
    setIsSave(true);
  }

  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    if (initialStream?.room_name) {
      fetch(`/api/live/token?room=${initialStream.room_name}&role=viewer`)
        .then((res) => res.json())
        .then((res) => setToken(res.token))
        .catch(console.error);
    }
  }, [initialStream?.room_name]);

  const handleSave = async () => {
    try {

    } catch (error) {
      console.log(error);

    }

    setIsSave(false);
  }

  return (
    <div className="w-full h-full flex flex-col group/sidebar">
      <div className="flex flex-1 flex-col gap-2 overflow-y-auto scrollbar-hover">
        <div className="flex-1 flex flex-col bg-[#181818]">
          <div className="flex items-start relative">
            <div className="flex-1 relative bg-black">
              <div className="flex-1 bg-card border border-border overflow-hidden shadow-lg w-full aspect-video object-contain">
                <div className="relative w-full aspect-video">
                  <LiveKitRoom
                    serverUrl={kiwameConfig.nextPublicLivekitURL}
                    token={token!}
                    connect={true}
                    className="absolute inset-0 w-full h-full"
                  >
                    <StreamCleanup />
                    <VideoView />
                    <RoomAudioRenderer volume={0.7} />
                  </LiveKitRoom>
                </div>
              </div>
              <div className="absolute top-2.5 left-2.5 flex gap-2 items-center">
                <Button text="LIVE" icon={<Radio size={18} />} size="sm" variant="danger" />
                <div className="bg-black/70 backdrop-blur px-2.5 py-1.5 rounded text-sm">
                  {viewCount.toLocaleString()} đang xem
                </div>
              </div>
            </div>

            <div className="flex flex-2 p-4 pb-0 items-start justify-between gap-4">
              <div className="w-full flex flex-col items-start justify-start gap-2.5">
                <div className="flex flex-col items-start gap-2 w-full">
                  <label className="text-sm text-gray-400">Tiêu đề</label>
                  {isEditing ? (
                    <Input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-[88%]!"
                    />
                  ) : (
                    <p className="text-lg font-bold line-clamp-1 max-w-180">{title}</p>
                  )}
                </div>
                <div className="flex items-start gap-6">
                  <div className="flex flex-col items-start gap-2">
                    <label className="text-sm text-gray-400">Danh mục</label>
                    {isEditing ? (
                      <Select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        options={[
                          { label: "Trò chơi", value: "Trò chơi" },
                          { label: "Âm nhạc", value: "Âm nhạc" },
                          { label: "Giải trí", value: "Giải trí" },
                          { label: "Học tập", value: "Học tập" },
                        ]}
                      />
                    ) : (
                      <p className="text-md font-bold">{category}</p>
                    )}
                  </div>

                  <div className="flex flex-col items-start gap-2">
                    <label className="text-sm text-gray-400">{category}</label>
                    <p className="text-md font-bold">-</p>
                  </div>

                  <div className="flex flex-col items-start gap-2">
                    <label className="text-sm text-gray-400">Quyền riêng tư</label>
                    {isEditing ? (
                      <Select
                        value={privacy}
                        onChange={(e) => setPrivacy(e.target.value)}
                        options={[
                          { label: "Công khai", value: "Công khai" },
                          { label: "Riêng tư", value: "Riêng tư" },
                        ]}
                      />
                    ) : (
                      <p className="text-md font-bold">{privacy}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-start gap-6">
                  <div className="flex flex-col items-start gap-2">
                    <label className="text-sm text-gray-400">Số người xem đang đợi</label>
                    <p className="text-md font-bold">0</p >
                  </div>

                  <div className="flex flex-col items-start gap-2">
                    <label className="text-sm text-gray-400">Lượt thích</label>
                    <p className="text-md font-bold">-</p>
                  </div>
                </div>
              </div>
            </div>

            {isSave && (
              <Button
                icon={
                  <Save size={18} />
                }
                onClick={handleSave}
                radius="full"
                variant="dark"
                size="sm"
                className="p-2.5! absolute top-4 right-16 border border-white"
              />
            )}

            <Button
              icon={
                !isEditing ?
                  <PencilLine size={18} /> :
                  <PencilOff size={18} />
              }
              onClick={() => {
                setIsEditing(!isEditing);
                if (isEditing) setIsSave(true);
              }}
              radius="full"
              variant="dark"
              size="sm"
              className="p-2.5! absolute top-4 right-4 border border-white"
            />
          </div>
          <div className="p-2.5 flex items-center gap-2">
            <Flag size={18} color="#ff0000" />
            <p className="text-base text-gray-400">Để phát trực tiếp, hãy gữi video của bạn đến Kiwame bằng phần mền phát trực tiếp</p>
          </div>
        </div>

        <div className="flex flex-1 bg-[#181818] p-6 space-y-6 gap-4">
          <div className="flex-1 space-y-4">
            <h3 className="text-lg font-semibold">Cài đặt phát trực tiếp</h3>

            <div className="flex flex-col gap-4">
              <div className="bg-[#272727] rounded-lg p-4 space-y-3">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">URL máy chủ</p>
                <div className="flex items-center justify-between bg-[#1a1a1a] rounded px-3 py-2">
                  <code className="text-sm font-mono text-gray-300">{initialStream?.whip_url}</code>
                  <CopyButton value={initialStream?.whip_url} />
                </div>
              </div>

              <div className="bg-[#272727] rounded-lg p-4 space-y-3">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Khóa phát trực tiếp</p>
                <div className="flex items-center justify-between bg-[#1a1a1a] rounded px-3 py-2">
                  <code className="text-sm font-mono text-gray-300">
                    {visible ? initialStream?.stream_key : "••••••••"}
                  </code>
                  <div className="flex items-center gap-2">
                    <Button
                      icon={visible ? <EyeOff className="w-4 h-4 text-gray-300" /> : <Eye className="w-4 h-4 text-gray-300" />}
                      variant="dark"
                      size="sm"
                      onClick={() => setVisible(!visible)}
                      className="p-2.5!"
                    />
                    <CopyButton value={initialStream?.stream_key} />
                  </div>
                </div>
              </div>

              <div className="bg-[#272727] rounded-lg p-4 space-y-3">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Room name</p>
                <div className="flex items-center justify-between bg-[#1a1a1a] rounded px-3 py-2">
                  <code className="text-sm font-mono text-gray-300">{initialStream?.room_name}</code>
                  <CopyButton value={initialStream?.room_name} />
                </div>
              </div>
            </div>

            {/* Các cài đặt nâng cao */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="flex flex-col items-start gap-2">
                <label className="text-gray-400">Độ trễ</label>
                {isEditing ? (
                  <Select
                    value={delay}
                    onChange={(e) => setDelay(e.target.value)}
                    options={[
                      { label: "Thấp", value: "Thấp" },
                      { label: "Bình thường", value: "Bình thường" },
                      { label: "Cao", value: "Cao" },
                    ]}
                  />
                ) : (
                  <p className="font-semibold text-green-500">{delay}</p>
                )}
              </div>
              <div className="flex flex-col items-start gap-2">
                <p className="text-gray-400">DVR</p>
                <p className="font-semibold text-blue-500">Bật</p>
              </div>
              <div className="flex flex-col items-start gap-2">
                <p className="text-gray-400">360°</p>
                <p className="font-semibold text-gray-500">Tắt</p>
              </div>
              <div className="flex flex-col items-start gap-2">
                <label className="text-gray-400">Phụ đề</label>
                {isEditing ? (
                  <Select
                    value={subTitles ? "Có" : "Không"}
                    onChange={(e) => setSubTitles(e.target.value === "Có")}
                    options={[
                      { label: "Không", value: "Không" },
                      { label: "Có", value: "Có" },
                    ]}
                  />
                ) : (
                  <p className="font-semibold text-gray-500">{subTitles ? "Có" : "Không"}</p>
                )}
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-800/50 rounded-lg p-4 flex gap-4">
              <div className="text-2xl">
                <Info />
              </div>
              <div>
                <p className="font-semibold">Sao chép thông tin trên vào OBS Studio</p>
              </div>
            </div>
          </div>

          <div className="flex-1 space-y-4">
            <h3 className="text-lg font-semibold">Thumbnail</h3>

            <div
              onClick={handlePickThumbnail}
              onDrop={(e) => handleDrog(e, setThumbnailFile, setThumbnailPreview)}
              onDragOver={(e) => e.preventDefault()}
              className={clsx(
                "group relative flex h-[140px] w-full cursor-pointer items-center justify-center rounded-xl border-2 bg-white/5 transition",
                thumbnailPreview
                  ? "border-white/20"
                  : "border-dashed border-white/15 hover:border-white"
              )}
            >
              <input
                ref={thumbnailRef}
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFile(file, setThumbnailFile, setThumbnailPreview);
                }}
              />

              {thumbnailPreview ? (
                <Image
                  src={thumbnailPreview}
                  alt="thumbnail preview"
                  width={600}
                  height={240}
                  className="h-full w-full rounded-xl object-cover"
                />
              ) : (
                <div className="text-center">
                  <UploadCloud className="mx-auto mb-2 h-8 w-8 text-gray-400 group-hover:text-white transition" />
                  <p className="text-sm text-gray-400">
                    Upload Thumbnail
                  </p>
                </div>
              )}
            </div>

            <h3 className="text-lg font-semibold">Mô tả</h3>

            <div className="w-full">
              <div className="bg-[#272727] rounded-lg p-4">
                {isEditing ? (
                  <Textarea
                    placeholder="Một chút mô tả về live của bạn..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={14}
                  />
                ) : (
                  <p className="text-sm text-gray-300 leading-relaxed break-all whitespace-pre-wrap max-h-64 overflow-y-auto">{description}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div >
  );
}
