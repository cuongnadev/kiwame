import { Upload, X } from "lucide-react";
import { Button } from "../../ui/button/Button";
import Link from "next/link";

interface UploadSelectedFileProps {
    handleDrag: (e: React.DragEvent) => void,
    handleDrop: (e: React.DragEvent) => void,
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    fileInputRef: React.RefObject<HTMLInputElement | null>,
    isDragActive?: boolean,
    onClose: () => void,
}

export default function UploadSelectedFile({ handleDrag, handleDrop, handleChange, fileInputRef, isDragActive, onClose }: UploadSelectedFileProps) {
    return (
        < div className="flex flex-col bg-neutral-800 rounded-4xl shadow-2xl max-w-4xl w-full max-h-11/12 h-full overflow-y-auto ">
            <div className="flex justify-between py-2 px-3 border-b border-b-gray-500 items-center">
                <h2 className="text-white text-xl font-bold p-2">Tải video lên</h2>
                <Button
                    icon={<X size={20} />}
                    onClick={onClose}
                    variant="ghost"
                    radius="full"
                />
            </div>
            <div className="w-full">
                <div
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    className={`rounded-xl md:p-12 text-center transition-all cursor-pointer ${isDragActive
                        ? " bg-neutral-500/10"
                        : " bg-neutral-800/50 "
                        }`}
                >
                    <div className="flex justify-center pt-20 pb-2">
                        <Button
                            icon={<Upload className="w-16 h-16" />}
                            onClick={() => fileInputRef.current?.click()}
                            variant="outline"
                            radius="full"
                            className="p-10! border-none bg-neutral-900/40! text-neutral-400!"
                        />
                    </div>

                    <p className="text-white text-lg mb-6">Kéo thả video để tải lên</p>

                    <Button
                        text="Chọn tệp"
                        icon={<Upload size={15} />}
                        onClick={() => fileInputRef.current?.click()}
                        className="inline-flex items-center gap-2 text-[14px]! py-2!"
                        variant="primary"
                        radius="full"
                    />

                    <input ref={fileInputRef} type="file" accept="video/*" onChange={handleChange} className="hidden" />

                </div>
            </div>
            <div className="flex flex-col w-full text-center px-4 py-4 gap-1">
                <span className="text-[12px] text-neutral-300">
                    Khi gửi video lên Kiwame, bạn xác nhận rằng bạn đồng ý với{" "}
                    <Link href="https://www.kiwame.com/t/terms" target="_blank" className="underline text-blue-400">
                        Điều khoản dịch vụ
                    </Link>{" "}
                    và{" "}
                    <Link href="https://www.kiwame.com/howyoutubeworks/policies/community-guidelines/" target="_blank" className="underline text-blue-400">
                        Nguyên tắc cộng đồng
                    </Link>{" "}
                    của YouTube.
                </span>

                <span className="text-[12px] text-neutral-300">
                    Bạn cần đảm bảo không vi phạm bản quyền hoặc quyền riêng tư của người khác.{" "}
                    <Link href="https://www.kiwame.com/howyoutubeworks/policies/copyright/" target="_blank" className="underline text-blue-400">
                        Tìm hiểu thêm
                    </Link>
                </span>
            </div>
        </div>
    )
}