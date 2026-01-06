import Link from "next/link";
import { Captions, Info, Monitor } from "lucide-react";

import { Button } from "@/app/components/ui";

export default function ComponentsVideoUpload() {
  return (
    <div className="px-10 w-full">
      <div className="max-w-5xl mx-auto py-2">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-3">
            Các thành phần của video
          </h1>
          <p className="text-gray-300 text-xs">
            Hãy dùng thẻ và màn hình kết thúc để cho người xem thấy các trang web, lời kêu gọi hành động và các video có liên quan.{' '}
            <Link href="#" className="text-blue-400 hover:text-blue-300 underline">
              Tìm hiểu thêm
            </Link>
          </p>
        </div>

        {/* Elements List */}
        <div className="space-y-4">
          {/* Thêm phụ đề */}
          <div className="bg-neutral-800 rounded-lg p-6 border border-neutral-700 hover:border-neutral-600 transition-colors">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4 flex-1">
                <div className="flex-shrink-0 mt-1">
                  <Captions className="w-6 h-6 text-gray-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-white text-lg font-semibold mb-1">
                    Thêm phụ đề
                  </h3>
                  <p className="text-gray-400 text-sm">
                    Tiếp cận nhiều khán giả hơn bằng cách thêm phụ đề cho video của bạn
                  </p>
                </div>
              </div>
              <Button
                text="Thêm"
                variant="outline"
                className="border-none bg-neutral-700! hover:bg-neutral-600!"
                radius="full"
              />
            </div>
          </div>

          {/* Thêm màn hình kết thúc */}
          <div className="bg-neutral-800 rounded-lg p-6 border border-neutral-700 hover:border-neutral-600 transition-colors">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4 flex-1">
                <div className="flex-shrink-0 mt-1">
                  <Monitor className="w-6 h-6 text-gray-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-white text-lg font-semibold mb-1">
                    Thêm màn hình kết thúc
                  </h3>
                  <p className="text-gray-400 text-sm">
                    Quảng cáo nội dung có liên quan ở cuối video
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  text="Nhập từ video"
                  variant="outline"
                  className="border-none bg-neutral-700! hover:bg-neutral-600!"
                  radius="full"
                />
                <Button
                  text="Thêm"
                  variant="outline"
                  className="border-none bg-neutral-700! hover:bg-neutral-600!"
                  radius="full"
                />
              </div>
            </div>
          </div>

          {/* Thêm thẻ */}
          <div className="bg-neutral-800 rounded-lg p-6 border border-neutral-700 hover:border-neutral-600 transition-colors">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4 flex-1">
                <div className="flex-shrink-0 mt-1">
                  <Info className="w-6 h-6 text-gray-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-white text-lg font-semibold mb-1">
                    Thêm thẻ
                  </h3>
                  <p className="text-gray-400 text-sm">
                    Quảng cáo nội dung có liên quan trong video
                  </p>
                </div>
              </div>
              <Button
                text="Thêm"
                variant="outline"
                className="border-none bg-neutral-700! hover:bg-neutral-600!"
                radius="full"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
