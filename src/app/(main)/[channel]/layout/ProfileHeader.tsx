import { Button } from "@/app/components/ui/button/Button";
import Image from "next/image";
import { useState } from "react";
import { X, Globe, Info, Share2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface ProfileHeaderProps {
  channel: string;
}

export default function ProfileHeader({ channel }: ProfileHeaderProps) {
  const router = useRouter();
  const [showMore, setShowMore] = useState(false);

  return (
    <div className="flex pl-12 gap-4">
      {/* Avatar */}
      <div className="p-2 rounded-full bg-gray-600 border-4 border-gray-800">
        <Image
          src="https://avatar.iran.liara.run/public"
          alt="Profile Avatar"
          width={128}
          height={128}
          className="w-full h-full rounded-full object-cover"
          priority
        />
      </div>

      {/* Channel Info */}
      <div className="flex flex-col relative">
        <h1 className="text-3xl sm:text-4xl font-black mb-2">Huy Ngvan</h1>
        <p className="text-muted-foreground text-base mb-1">@ngvanhuy0000</p>
        <p className="text-sm text-muted-foreground mb-4">Tìm hiểu thêm về kênh này <span onClick={() => setShowMore(!showMore)} className="text-white font-bold cursor-pointer">...xem thêm</span></p>
        {showMore && (
          <div className="absolute top-4/6 left-2 transition-opacity duration-300 mt-2 p-4 w-96 bg-neutral-800 rounded-md shadow-lg z-10">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold mb-2">Huy Ngvan</h2>
              <Button
                icon={<X size={24} className="font-bold" />}
                onClick={() => setShowMore(!showMore)}
                variant="outline"
                radius="full"
                className="p-2! border-none"
              />
            </div>

            <div className="flex flex-col gap-3">
              <h3>Thông tin khác</h3>
              <div className="flex items-center gap-3">
                <Globe size={20} className="mr-2 mt-1" />
                <Link href={`/${channel}`} className="text-base ">www.kiwame.vn/{channel}</Link>
              </div>
              <div className="flex items-center gap-3">
                <Info size={20} className="mr-2 mt-1" />
                <p className="text-base ">Đã tham gia 25 thg 11, 2025</p>
              </div>
            </div>

            <div className="my-4">
              <Button
                icon={<Share2 size={16} />}
                text="Chia sẻ kênh"
                variant='dark'
                size="sm"
                radius="full"
                className="text-sm px-3! py-2! bg-neutral-700!"
              />
            </div>
          </div>
        )}
        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            text="Tùy chỉnh kênh"
            variant='dark'
            size="md"
            radius="full"
            className="text-sm px-3! py-2!"
            onClick={() => router.push(`/studio/channel/${channel}/editing`)}
          />
          <Button
            text="Quản lý video"
            variant='dark'
            size="sm"
            radius="full"
            className="text-sm px-3! py-2!"
            onClick={() => router.push(`/studio/channel/${channel}/upload`)}
          />
        </div>
      </div>

    </div>
  )
}
