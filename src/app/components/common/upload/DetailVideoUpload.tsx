import { AlertCircle, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Button } from "../../ui/button/Button";

interface DetailVideoUploadProps {
    title: string,
    setTitle: (title: string) => void,
    description: string,
    thumbnailUrl: string | null,
    forChildren?: boolean,
    setDescription: (description: string) => void,
    setThumbnailFile: (file: File | null) => void,
    setForChildren: (forChildren: boolean | null) => void,
    setThumbnailUrl?: (url: string) => void,
    videoUrl?: string,
    videoFileName: string,
    error: string
}

export default function DetailVideoUpload({ title, description, forChildren, thumbnailUrl, setTitle, setDescription, setForChildren, setThumbnailFile, videoUrl, videoFileName, error }: DetailVideoUploadProps) {
    const thumbnailInputRef = useRef<HTMLInputElement>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [showTooltip, setShowTooltip] = useState(false);
    const [generateUrl, setGenerateUrl] = useState<string | null>(null);

    const isEmpty = title.trim() === '';
    const hasError = error === "detail"
    useEffect(() => {
        if (thumbnailUrl) {
            setGenerateUrl(thumbnailUrl)
        }
    }, [thumbnailUrl])
    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && file.type.startsWith('image/')) {
            setThumbnailFile(file);
            // Create preview URL
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUploadClick = () => {
        thumbnailInputRef.current?.click();
    };

    const handleRemoveImage = () => {
        setThumbnailFile(null);
        setPreviewUrl(null);
        if (thumbnailInputRef.current) {
            thumbnailInputRef.current.value = '';
        }
    };
    return (
        <>
            <div className="px-10 w-full">
                <h3 className="text-white text-xl font-bold mb-4">Chi tiết video</h3>
                <div className="flex justify-between">
                    <div className="flex flex-col gap-6 flex-1 pr-8 ">
                        <div className={`relative bg-neutral-800 rounded-lg border-2  focus-within:outline-offset-2 transition-all duration-200 
                            ${isEmpty ? 'border-red-400' : 'border-neutral-700 hover:border-white focus-within:border-white focus-within:outline-white'}`}>
                            <div className="flex items-center justify-between px-4 pt-3 pb-1">
                                <label className={`flex items-center gap-2  text-xs
                                    ${isEmpty ? 'text-red-300' : 'text-gray-400'}`}>
                                    Tiêu đề (bắt buộc)
                                    <span className="w-3.5 h-3.5 rounded-full border border-gray-500 flex items-center justify-center text-gray-500 hover:border-gray-400 hover:text-gray-400 transition-colors" style={{ fontSize: '9px' }}>
                                        ?
                                    </span>
                                </label>
                            </div>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => {
                                    setTitle(e.target.value)
                                }}
                                onFocus={() => setShowTooltip(true)}
                                onBlur={() => setShowTooltip(false)}
                                className="w-full bg-transparent text-white px-4 pb-3 focus:outline-none"
                                placeholder="Tiêu đề video"
                            />
                            {isEmpty && (
                                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                    <AlertCircle className="w-5 h-5 text-red-400" />
                                </div>
                            )}

                            {/* Tooltip */}
                            {showTooltip && isEmpty && (
                                <div className="absolute left-0 top-full mt-2 z-50 animate-in fade-in slide-in-from-top-1 duration-200">
                                    <div className="bg-neutral-500 text-white text-xs px-3 py-2 rounded-lg shadow-lg relative">
                                        <div className="absolute -top-1 left-4 w-2 h-2 bg-neutral-500 rotate-45"></div>
                                        Bạn cần đặt tiêu đề cho video của bạn
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="relative bg-neutral-800 rounded-lg border-2 border-neutral-700 hover:border-white focus-within:border-white focus-within:outline-white focus-within:outline-offset-2 transition-all duration-200">
                            <div className="flex items-center justify-between px-4 pt-3 pb-1">
                                <label className="flex items-center gap-2 text-gray-400 text-xs">
                                    Mô tả
                                    <span className="w-3.5 h-3.5 rounded-full border border-gray-500 flex items-center justify-center text-gray-500 hover:border-gray-400 hover:text-gray-400 transition-colors" style={{ fontSize: '9px' }}>
                                        ?
                                    </span>
                                </label>
                            </div>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={4}
                                className="w-full bg-transparent text-white text-sm px-4 pb-3 focus:outline-none resize-none"
                                placeholder="Giới thiệu về video của bạn cho người xem (nhập ký tự @ để đề cập tên một kênh)"
                            />
                        </div>
                        <div className="flex flex-col">
                            <h5>Hình thu nhỏ</h5>
                            <span className="text-xs">Chọn hình thu nhỏ nổi bật để thu hút sự chú ý của người xem.
                                <Link href="#" className="underline text-blue-400"> Tìm hiểu thêm </Link>
                            </span>
                            <div className="w-full py-4 flex gap-3">
                                {/* Upload Image Card */}
                                <div
                                    onClick={handleUploadClick}
                                    className="relative w-1/3 border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 hover:bg-neutral-600 transition-all h-[120px] group"
                                >
                                    <input
                                        ref={thumbnailInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileSelect}
                                        className="hidden"
                                    />

                                    {previewUrl ? (
                                        <div className="relative w-full h-full">
                                            <Image
                                                src={previewUrl}
                                                alt="Preview"
                                                fill
                                                className="object-cover rounded"
                                            />
                                            <Button
                                                icon={<X size={16} />}
                                                onClick={(e) => {
                                                    e?.stopPropagation();
                                                    handleRemoveImage();
                                                }}
                                                variant="outline"
                                                radius="full"
                                                className="absolute top-2 right-2 p-2! bg-neutral-400!"
                                            />
                                        </div>
                                    ) : (
                                        <>
                                            <svg className="w-12 h-12 text-gray-400 mb-3 group-hover:text-gray-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            <span className="text-sm text-gray-600 group-hover:text-gray-700">Tải ảnh lên</span>
                                        </>
                                    )}
                                </div>
                                <div
                                    className="relative w-1/3 border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 hover:bg-neutral-600 transition-all h-[120px] group"
                                >
                                    {generateUrl && (
                                        <div className="relative w-full h-full">
                                            <Image
                                                src={generateUrl}
                                                alt="Preview"
                                                fill
                                                className="object-cover rounded"
                                            />
                                            <div className="absolute flex items-center justify-center top-0 h-full bg-black opacity-30">
                                                <span className="text-xs text-center text-white">Ảnh được tạo tự động</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        {/* Hạn chế */}
                        <div className="flex flex-col">
                            <div className="flex flex-col pb-4">
                                <h5>Đối tượng người xem</h5>
                                <h2 className="text-white text-sm font-semibold py-2">
                                    {forChildren === null ? "Video này có dành cho trẻ em không? (bắt buộc)" : forChildren ? "Video này được đặt là dành cho trẻ em" : "Video này được đặt là không dành cho trẻ em"}
                                    {forChildren !== null && (<span className="ml-2 px-2 py-1 text-xs rounded-lg bg-neutral-600 ">Do bạn đặt</span>)}
                                </h2>
                                <p className="text-gray-300 text-xs leading-relaxed">
                                    Dù hoạt động ở quốc gia nào, bạn cũng có nghĩa vụ pháp lý phải tuân thủ Đạo luật bảo vệ
                                    quyền riêng tư của trẻ em trên mạng (COPPA) và/hoặc các luật khác. Bạn phải cho chúng tôi
                                    biết video của bạn có dành cho trẻ em hay không.{' '}
                                    <Link
                                        href="#"
                                        className="text-blue-400 hover:text-blue-300 underline transition-colors"
                                    >
                                        Thế nào là nội dung dành cho trẻ em?
                                    </Link>
                                </p>
                            </div>
                            <div className={`relative flex flex-col mb-4 gap-2 ${(forChildren === null && hasError) ? 'border-2 border-red-400 rounded-2xl p-2 -translate-x-3' : ''
                                }`}>
                                <label
                                    className={`flex items-center gap-2 rounded-lg cursor-pointer transition-all`}
                                >
                                    <input
                                        type="radio"
                                        checked={forChildren === true}
                                        onChange={() => setForChildren(true)}
                                        className="w-5 h-5 appearance-none cursor-pointer rounded-full 
                                                    border-2 border-neutral-600 bg-neutral-700 
                                                    checked:bg-transparent checked:border-[7px] checked:border-white 
                                                    transition-all"
                                    />
                                    <span className="text-white font-sm">
                                        Có, nội dung này dành cho trẻ em
                                    </span>
                                </label>

                                <label
                                    className={`flex items-center gap-2 rounded-lg cursor-pointer transition-all`}
                                >
                                    <input
                                        type="radio"
                                        checked={forChildren === false}
                                        onChange={() => setForChildren(false)}
                                        className="w-5 h-5 appearance-none cursor-pointer rounded-full 
                                                    border-2 border-neutral-600 bg-neutral-700 
                                                    checked:bg-transparent checked:border-[7px] checked:border-white 
                                                    transition-all"
                                    />
                                    <span className="text-white font-sm">
                                        Không, nội dung này không dành cho trẻ em
                                    </span>
                                </label>
                                {(forChildren === null && hasError) && (
                                    <div className="absolute left-0 top-full mt-2 z-50 animate-in fade-in slide-in-from-top-1 duration-200">
                                        <div className="bg-neutral-500 text-white text-xs px-3 py-2 rounded-lg shadow-lg relative">
                                            <div className="absolute -top-1 left-4 w-2 h-2 bg-neutral-500 rotate-45"></div>
                                            Bạn cần phải trả lời câu hỏi này!
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="h-80 sticky top-10 flex flex-col justify-start items-end">
                        <video src={videoUrl}
                            controls
                            className="w-80 rounded-t-lg shadow-lg p-0 m-0" />
                        <div className="bg-neutral-900 w-80 rounded-b-lg flex flex-col p-2">
                            <span className="text-xs text-neutral-500 font-semibold" >Đường liên kết của video</span>
                            <Link href="#" className="underline text-blue-400 mb-3">
                                https://www.kiwame.com/...
                            </Link>
                            <span className="text-xs text-neutral-500 font-semibold">Tên tệp</span>
                            <span className="text-base">{videoFileName}</span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}