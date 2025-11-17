import {
    Menu, Mic, Bell, CircleUserRound, Plus,
    UserRound, LogOut, Video, Database,
    Monitor, Languages, MapPinned, Settings,
    HelpCircle, MessageSquareMore, ChevronRight
} from "lucide-react"
import { Button } from "../button/Button"
import Link from "next/link"
import Image from "next/image"
import logo from "@/assets/images/logo.png"
import logoText from "@/assets/images/logo_text.png"
import { Input } from "../input/Input"
import { Popup } from "../popup/Popup"

interface HeaderProps {
    onMenuClick: () => void,
    isLogin?: boolean,
}

export const menuItems = [
    {
        icon: <UserRound size={18} />,
        label: "Chuyển đổi tài khoản",
        href: "/switch-account",
    },
    {
        icon: <LogOut size={18} />,
        label: "Đăng xuất",
        href: "/logout",
    },
    {
        icon: <Video size={18} />,
        label: "Video của bạn",
        href: "/your-videos",
    },
    {
        icon: <Database size={18} />,
        label: "Dữ liệu của bạn",
        href: "/your-data",
    },
]

export const nestedMenuItems = [
    {
        icon: <Monitor size={18} />,
        label: "Giao diện thiết bị",
        showChevron: true,
        children: [
            { label: "Tối", value: "dark" },
            { label: "Sáng", value: "light" },
            { label: "Theo hệ thống", value: "system" },
        ]
    },
    {
        icon: <Languages size={18} />,
        label: "Ngôn ngữ",
        showChevron: true,
        children: [
            { label: "Tiếng Việt", value: "vi" },
            { label: "English", value: "en" },
            { label: "日本語", value: "jp" },
        ]
    },
    {
        icon: <MapPinned size={18} />,
        label: "Địa điểm",
        showChevron: true,
        children: [
            { label: "Việt Nam", value: "vn" },
            { label: "Hoa Kỳ", value: "us" },
            { label: "Hàn Quốc", value: "kr" },
        ]
    },
]

export const miscMenuItems = [
    {
        icon: <Settings size={18} />,
        label: "Cài đặt",
        href: "/settings",
    },
    {
        icon: <HelpCircle size={18} />,
        label: "Trợ giúp",
        href: "/help",
    },
    {
        icon: <MessageSquareMore size={18} />,
        label: "Gửi ý kiến phản hồi",
        href: "/feedback",
    },
]



export default function Header({ onMenuClick, isLogin }: HeaderProps) {
    return (
        <header className="sticky top-0 z-40 w-full border-b border-[#222] bg-[#0f0f0f] px-4 py-3">
            <div className="flex items-center justify-between gap-4">
                {/* Left */}
                <div className="flex items-center gap-4">
                    <Button
                        onClick={onMenuClick}
                        text=""
                        icon={<Menu size={20} />}
                        variant="dark"
                        radius="full"
                    />
                    <div className="flex items-center">
                        <Link href={"/"} className="flex items-center">
                            <Image
                                src={logo}
                                width={50}
                                height={50}
                                alt="Kiwame Logo"
                            />
                            <Image
                                src={logoText}
                                width={200}
                                height={90}
                                alt="Kiwame Text Logo"
                                className="left-0 -translate-x-8"
                            />
                        </Link>
                    </div>
                </div>
                {/* Center */}
                <div className="hidden md:flex flex-1 max-w-2xl items-center gap-2">
                    <div className="flex w-full items-center gap-0">
                        <Input
                            placeholder="Tìm kiếm"
                            type="search"
                            variant="search"
                        />
                    </div>
                    <Button
                        text=""
                        icon={<Mic size={20} />}
                        variant="dark"
                        radius="full"
                    />
                </div>
                {/* Right */}
                <div className="flex items-center gap-2">
                    <Button
                        icon={<Plus size={20} />}
                        variant="dark"
                        onClick={() => { }}
                        radius="full"
                        text="Tạo"
                    />
                    <Button
                        icon={<Bell size={20} />}
                        variant="dark"
                        onClick={() => { }}
                        radius="full"
                    />
                    {isLogin &&
                        <Popup
                            trigger={
                                <Button
                                    icon={<CircleUserRound size={20} />}
                                    variant="dark"
                                    onClick={() => { }}
                                    radius="full"
                                />
                            }
                            position="menu-left"
                        >
                            <div className="p-2 text-white space-y-1 w-60">

                                {/* Info */}
                                <div className="px-3 py-2 border-b border-white/10">
                                    <p className="font-semibold">Tên người dùng</p>
                                    <p className="text-sm text-gray-400">email@gmail.com</p>
                                </div>

                                {/* Section 1 */}
                                {menuItems.map((item, i) => (
                                    <Link
                                        key={i}
                                        href={item.href}
                                        className="flex items-center gap-3 px-3 py-2 hover:bg-white/10 rounded-lg"
                                    >
                                        {item.icon}
                                        <span>{item.label}</span>
                                    </Link>
                                ))}

                                {/* Section 2 (nested popup items) */}
                                {nestedMenuItems.map((item, i) => (
                                    <Popup
                                        key={i}
                                        position="left"
                                        trigger={
                                            <div className="flex items-center gap-3 px-3 py-2 hover:bg-white/10 rounded-lg cursor-pointer">
                                                {item.icon}
                                                <span>{item.label}</span>
                                                {item.showChevron &&
                                                    <ChevronRight size={16} className="ml-auto text-gray-400" />
                                                }
                                            </div>
                                        }
                                    >
                                        <div className="p-2 space-y-1">
                                            {item.children.map((child, idx) => (
                                                <div
                                                    key={idx}
                                                    className="px-3 py-2 hover:bg-white/10 rounded-md cursor-pointer"
                                                >
                                                    {child.label}
                                                </div>
                                            ))}
                                        </div>
                                    </Popup>
                                ))}

                                {/* Section 3 */}
                                {miscMenuItems.map((item, i) => (
                                    <Link
                                        key={i}
                                        href={item.href}
                                        className="flex items-center gap-3 px-3 py-2 hover:bg-white/10 rounded-lg"
                                    >
                                        {item.icon}
                                        <span>{item.label}</span>
                                    </Link>
                                ))}

                            </div>

                        </Popup>
                    }
                    {!isLogin &&
                        <Button
                            icon={<CircleUserRound size={20} />}
                            variant="dark"
                            onClick={() => { }}
                            radius="full"
                            text="Đăng nhập"
                        />
                    }
                </div>
            </div>
        </header>
    )
}