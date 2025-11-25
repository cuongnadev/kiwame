import { Input } from "@/app/components/ui/input/Input";
import { useState } from "react";
import Image from "next/image";
import TextareaAutosize from "react-textarea-autosize";
import { Button } from "@/app/components/ui/button/Button";
import { X, ImageIcon, ChartBarBig, SquareCheckBig, Film, ChevronDown, Clock } from "lucide-react"
import { Popup } from "@/app/components/ui/popup/Popup";

export default function CreatePostForm() {
    const [showTypeOptions, setShowTypeOptions] = useState(false);
    const [typeOptions, setTypeOptions] = useState("");
    const [content, setContent] = useState("");
    const [activeForm, setActiveForm] = useState(false);
    const [showSchedule, setShowShedule] = useState(false);
    return (
        <div className={`flex flex-col items-center justify-between  gap-0 border border-gray-600 w-1/2 p-4 rounded-lg 
            ${activeForm ? "bg-[#222]" : "bg-transparent"}`}>
            <div className="flex items-center justify-between w-full ">
                <div className="flex items-center gap-3">
                    <div className="flex rounded-full bg-gray-600 border-4 border-gray-800">
                        {/* Avatar Image */}
                        <Image
                            src="https://i.pinimg.com/736x/b7/91/44/b79144e03dc4996ce319ff59118caf65.jpg"
                            alt="Profile Avatar"
                            width={30}
                            height={30}
                            className="w-full h-full rounded-full object-cover"
                        />
                    </div>
                    <h2>Huy Ngvan</h2>
                </div>
                <div className="flex gap-5 text-neutral-500">
                    <p>Trạng thái hiển thị:</p>
                    <p>Công khai</p>
                </div>
            </div>
            <div className="w-full">
                <TextareaAutosize
                    value={content}
                    onChange={(e) => { setContent(e.target.value) }}
                    onFocus={() => setActiveForm(true)}
                    minRows={1}
                    placeholder="Hãy bắt đầu viết gì đó và tạo các bài đăng thú vị"
                    className="w-full bg-transparent text-white p-3 rounded-lg resize-none border-none focus:outline-0   "
                />
            </div>
            {/* Pool Options */}
            <div className="flex flex-col w-full">
                <div className="flex justify-start w-full">
                    <Button
                        text="Hình ảnh"
                        icon={<ImageIcon size={20} />}
                        variant="outline"
                        className="border-none text-sm p-2!"
                        radius="full"
                    />
                    <Button
                        text="Cuộc thăm dò ý kiến dạng hình ảnh"
                        icon={<ChartBarBig size={20} />}
                        variant="outline"
                        className="border-none text-sm p-2!"
                        radius="full"
                    />
                </div>
                <div className={`flex justify-between w-full ${activeForm ? "flex-col" : ""
                    }`}>
                    <div className="flex justify-start">
                        <Button
                            text="Cuộc thăm dò ý kiến dạng văn bản"
                            icon={<ChartBarBig size={20} />}
                            variant="outline"
                            className="border-none text-sm p-2!"
                            radius="full"
                        />
                        <Button
                            text="Câu hỏi"
                            icon={<SquareCheckBig size={20} />}
                            variant="outline"
                            className="border-none text-sm p-2!"
                            radius="full"
                        />
                        <Button
                            text="Video"
                            icon={<Film size={20} />}
                            variant="outline"
                            className="border-none text-sm p-2!"
                            radius="full"
                        />
                    </div>
                    <div className={`flex justify-center ${activeForm ? "justify-end gap-3" : ""
                        }`}>
                        {activeForm &&
                            <Button
                                text="Hủy"
                                onClick={() => {
                                    setActiveForm(false);
                                    setContent('')
                                }}
                                variant="outline"
                                radius="full"
                                className="border-none"
                            />
                        }
                        <div className="flex items-center">
                            {showSchedule ? (
                                <>
                                    <Button
                                        text="Lên lịch"
                                        variant="primary"
                                        radius="full"
                                        className={`border-none text-sm ${content.trim() === "" ? "bg-none bg-neutral-600 shadow-none" : ""
                                            }`}
                                        disabled={content.trim() === ""}
                                    />
                                </>) : (
                                <>
                                    <Button
                                        text="Đăng"
                                        variant="primary"
                                        className={`border-none text-sm rounded-r-none pr-2 border-r-2 border-r-white ${content.trim() === "" ? "bg-none bg-neutral-600 shadow-none" : ""
                                            }`}
                                        radius="full"
                                        disabled={content.trim() === ""}
                                    />
                                    <Popup
                                        trigger={
                                            <Button
                                                icon={<ChevronDown size={20} />}
                                                variant="primary"
                                                className={`border-none text-sm rounded-l-none border-l-2 border-l-white ${content.trim() === "" ? "bg-none bg-neutral-600 shadow-none" : ""
                                                    }`}
                                                radius="full"
                                                disabled={content.trim() === ""}
                                            />

                                        }
                                        position="bottom"
                                        className="min-w-32!"
                                    >
                                        <div className="flex justify-center items-center w-full">
                                            <Button
                                                icon={<Clock size={20} />}
                                                text="Lên lịch bài đăng"
                                                onClick={() => setShowShedule(true)}
                                                variant="outline"
                                                className="border-none text-sm p-2! text-nowrap"
                                            />
                                        </div>
                                    </Popup>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            {showSchedule && (
                <div className="flex flex-col bg-[#0f0f0f] w-full mt-3 p-3 border-[0.5px] border-gray-600 rounded-2xl" >
                    <div className="flex items-center justify-between w-full">
                        <p className="font-bold text-sm text-neutral-400">Chọn ngày và giờ để xuất bản bài đăng này</p>
                        <Button
                            icon={<X size={20} />}
                            variant="outline"
                            onClick={() => setShowShedule(false)}
                            className="border-none p-2! text-neutral-400!"
                            radius="full"
                        />
                    </div>
                </div>
            )}
        </div>
    )
}
