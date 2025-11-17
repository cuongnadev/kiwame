import {
    Home, TvMinimalPlay, Zap, ClockFading,
    ListVideo, Clock, SquarePlay, ThumbsUp,
    CircleUserRound, ChevronRight, Music,
    Gamepad2, Newspaper, Trophy, Settings,
    BadgeQuestionMark, MessageCircleReply,
    Flag
} from "lucide-react";
import Link from "next/link";
interface SidebarProps {
    expanded?: boolean;
    isLogin?: boolean;
}

const mainMenuItems = [
    { icon: Home, label: 'Trang chủ', href: '/home' },
    { icon: Zap, label: 'Shorts', href: '/shorts' },
    { icon: TvMinimalPlay, label: 'Kênh đăng ký', href: '/channel-register', hasNotification: true },
];

const userMenuItems = [
    { icon: null, label: 'Bạn', href: '/you-not-login-yet', showChevron: true },
    { icon: ClockFading, label: 'Lịch sử xem', href: '/watch-later' },
    { icon: ListVideo, label: 'Danh sách phát', href: '/liked-videos' },
    { icon: SquarePlay, label: 'Video của bạn', href: '/your-videos' },
    { icon: Clock, label: 'Xem sau', href: '/history' },
    { icon: ThumbsUp, label: 'Video đã thích', href: '/liked-videos' },
];

const guestMenuItems = [
    { icon: CircleUserRound, label: 'Bạn', href: '/you-not-login-yet' },
    { icon: ClockFading, label: 'Lịch sử xem', href: '/watch-later' },
];

const titleMenu = [
    { icon: Music, label: 'Âm nhạc', href: '/music' },
    { icon: Gamepad2, label: 'Trò chơi', href: '/games' },
    { icon: Newspaper, label: 'Tin tức', href: '/news' },
    { icon: Trophy, label: 'Thể thao', href: '/sports' }
]

const systemMenuItems = [
    { icon: Settings, label: 'Cài đặt', href: '/settings' },
    { icon: BadgeQuestionMark, label: 'Trợ giúp', href: '/help' },
    { icon: MessageCircleReply, label: 'Gửi phản hồi', href: '/feedback' },
    { icon: Flag, label: 'Nhật ký báo cáo', href: '/report-history' },
]

export default function Sidebar({ expanded, isLogin }: SidebarProps) {
    return (
        <aside className={`overflow-y-auto border-r border-[#222] bg-[#0f0f0f] transition-all duration-300 ease-in-out ${expanded ? 'w-64' : 'w-20'}`}>
            {/* Main menu */}
            <nav className="space-y-1 px-3 py-4">
                {mainMenuItems.map((item) => (
                    <Link
                        key={item.label}
                        href={item.href}
                        className="flex items-center gap-4 rounded-lg px-3 py-2 text-[#f1f1f1] hover:bg-[#222] transition-colors group relative"
                        title={expanded ? '' : item.label}
                    >
                        <div className="relative flex flex-col">
                            <item.icon size={24} className="flex-shrink-0" />
                            {!expanded && <span className="text-xs">{item.label}</span>}
                            {item.hasNotification && (
                                <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full" />
                            )}
                        </div>
                        {expanded && <span className="text-base text-nowrap">{item.label}</span>}
                    </Link>
                ))}
            </nav>
            {/* User menu */}
            {expanded && isLogin && (
                <>
                    <div className="border-t border-[#222]" />
                    <nav className="space-y-1 px-3 py-4">
                        {userMenuItems.map((item) => (
                            <Link
                                key={item.label}
                                href={item.href}
                                className="flex items-center justify-between rounded-lg px-3 py-2 text-[#f1f1f1] hover:bg-[#222] transition-colors"
                                title={item.label}
                            >
                                <div className="flex items-center gap-4">
                                    {item.icon && (
                                        <item.icon size={24} className="flex-shrink-0" />
                                    )}
                                    <span className="text-base text-nowrap">{item.label}</span>
                                    {item.showChevron && <ChevronRight size={16} className="text-[#818181]" />}
                                </div>
                            </Link>
                        ))}
                    </nav>
                </>
            )}
            {/* Guest menu */}
            {expanded && !isLogin && (
                <>
                    <div className="border-t border-[#222]" />
                    <nav className="space-y-1 px-3 py-4">
                        {guestMenuItems.map((item) => (
                            <Link
                                key={item.label}
                                href={item.href}
                                className="flex items-center justify-between rounded-lg px-3 py-2 text-[#f1f1f1] hover:bg-[#222] transition-colors"
                                title={item.label}
                            >
                                <div className="flex items-center gap-4">
                                    {item.icon && (
                                        <item.icon size={24} className="flex-shrink-0" />
                                    )}
                                    <span className="text-base text-nowrap">{item.label}</span>
                                </div>
                            </Link>
                        ))}
                    </nav>
                </>
            )}
            {expanded &&

                <>
                    {/* Title menu */}
                    < div className="border-t border-[#222]" />
                    <h2 className="pt-3.5 px-4 text-base">Khám phá</h2>
                    <nav className="space-y-1 px-3 py-4">
                        {titleMenu.map((item) => (
                            <Link
                                key={item.label}
                                href={item.href}
                                className="flex items-center justify-between rounded-lg px-3 py-2 text-[#f1f1f1] hover:bg-[#222] transition-colors"
                                title={item.label}
                            >
                                <div className="flex items-center gap-4">
                                    {item.icon && (
                                        <item.icon size={24} className="flex-shrink-0" />
                                    )}
                                    <span className="text-base text-nowrap">{item.label}</span>
                                </div>
                            </Link>
                        ))}
                    </nav>
                    {/* System menu */}
                    <div className="border-t border-[#222]" />
                    <nav className="space-y-1 px-3 py-4">
                        {systemMenuItems.map((item) => (
                            <Link
                                key={item.label}
                                href={item.href}
                                className="flex items-center justify-between rounded-lg px-3 py-2 text-[#f1f1f1] hover:bg-[#222] transition-colors"
                                title={item.label}
                            >
                                <div className="flex items-center gap-4">
                                    {item.icon && (
                                        <item.icon size={24} className="flex-shrink-0" />
                                    )}
                                    <span className="text-base text-nowrap">{item.label}</span>
                                </div>
                            </Link>
                        ))}
                    </nav>
                </>
            }

        </aside>
    )
}