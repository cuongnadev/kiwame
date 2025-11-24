import { SpeedCycleIcon } from "@/app/components/ui/icons/SpeedCycleIcon";
import {
  UserRound, LogOut, Video, Database,
  Monitor, Languages, MapPinned,
  Settings, HelpCircle, MessageSquareMore,
  Home,
  Zap,
  TvMinimalPlay, ClockFading,
  ListVideo, Clock, SquarePlay, ThumbsUp,
  CircleUserRound, Music,
  Gamepad2, Newspaper, Trophy,
  BadgeQuestionMark, MessageCircleReply,
  Flag,
  Radio,
  SquarePen,
  PanelTopBottomDashed,
  ChevronRight,
  SlidersHorizontal
} from "lucide-react"
import { ReactNode } from "react";

export interface MenuChild {
  label: string;
  value: string;
}

export interface MenuItem {
  icon: ReactNode;
  label: string;
  href?: string;
  showChevron?: boolean;
  children?: MenuChild[];
}

export const menuItems: MenuItem[] = [
  {
    icon: <UserRound color="white" size={18} />,
    label: "Chuyển đổi tài khoản",
    href: "/switch-account",
  },
  {
    icon: <LogOut color="white" size={18} />,
    label: "Đăng xuất",
    href: "/logout",
  },
  {
    icon: <Video color="white" size={18} />,
    label: "Video của bạn",
    href: "/your-videos",
  },
  {
    icon: <Database color="white" size={18} />,
    label: "Dữ liệu của bạn",
    href: "/your-data",
  },
  {
    icon: <Monitor color="white" size={18} />,
    label: "Giao diện thiết bị",
    showChevron: true,
    children: [
      { label: "Tối", value: "dark" },
      { label: "Sáng", value: "light" },
      { label: "Theo hệ thống", value: "system" },
    ]
  },
  {
    icon: <Languages color="white" size={18} />,
    label: "Ngôn ngữ",
    showChevron: true,
    children: [
      { label: "Tiếng Việt", value: "vi" },
      { label: "English", value: "en" },
      { label: "日本語", value: "jp" },
    ]
  },
  {
    icon: <MapPinned color="white" size={18} />,
    label: "Địa điểm",
    showChevron: true,
    children: [
      { label: "Việt Nam", value: "vn" },
      { label: "Hoa Kỳ", value: "us" },
      { label: "Hàn Quốc", value: "kr" },
    ]
  },

  {
    icon: <Settings color="white" size={18} />,
    label: "Cài đặt",
    href: "/settings",
  },
  {
    icon: <HelpCircle color="white" size={18} />,
    label: "Trợ giúp",
    href: "/help",
  },
  {
    icon: <MessageSquareMore color="white" size={18} />,
    label: "Gửi ý kiến phản hồi",
    href: "/feedback",
  },
]

export const mainMenuItems = [
  { icon: Home, label: 'Trang chủ', href: '/' },
  { icon: Zap, label: 'Shorts', href: '/shorts' },
  { icon: TvMinimalPlay, label: 'Kênh đăng ký', href: '/subscriptions', hasNotification: true },
];

export const userMenuItems = [
  { icon: null, label: 'Bạn', href: '/account', showChevron: true },
  { icon: ClockFading, label: 'Lịch sử xem', href: '/watch-later' },
  { icon: ListVideo, label: 'Danh sách phát', href: '/playlists' },
  { icon: SquarePlay, label: 'Video của bạn', href: '/channel' },
  { icon: Clock, label: 'Xem sau', href: '/playlist/watch-later' },
  { icon: ThumbsUp, label: 'Video đã thích', href: '/playlist/liked' },
];

export const guestMenuItems = [
  { icon: CircleUserRound, label: 'Bạn', href: '/you-not-login-yet' },
  { icon: ClockFading, label: 'Lịch sử xem', href: '/watch-later' },
];

export const titleMenu = [
  { icon: Music, label: 'Âm nhạc', href: '/music' },
  { icon: Gamepad2, label: 'Trò chơi', href: '/games' },
  { icon: Newspaper, label: 'Tin tức', href: '/news' },
  { icon: Trophy, label: 'Thể thao', href: '/sports' }
]

export const systemMenuItems = [
  { icon: Settings, label: 'Cài đặt', href: '/settings' },
  { icon: BadgeQuestionMark, label: 'Trợ giúp', href: '/help' },
  { icon: MessageCircleReply, label: 'Gửi phản hồi', href: '/feedback' },
  { icon: Flag, label: 'Nhật ký báo cáo', href: '/report-history' },
]

export const studioItems = [
  { icon: <SquarePlay width={20} height={20} />, label: 'Tải video lên', href: '/studio/upload' },
  { icon: <Radio width={20} height={20} />, label: 'Phát trực tiếp', href: '/studio/live' },
  { icon: <SquarePen width={20} height={20} />, label: 'Tạo bài đăng', href: '/studio/post' },
]

export const videoSettingsItems = [
  {
    icon_1: <PanelTopBottomDashed color="white" className='w-5 h-5  my-[-16px] ' />,
    label_1: 'Phụ đề',
    icons_2: <ChevronRight color="white" className='w-5 h-5  my-[-16px] ' />,
    label_2: 'Tiếng Việt'
  },
  {
    icon_1: <SpeedCycleIcon className='w-5 h-5 text-white my-[-16px]' />,
    label_1: 'Tốc độ phát',
    icons_2: <ChevronRight color="white" className='w-5 h-5  my-[-16px] ' />,
    label_2: 'Chuẩn'
  },
  {
    icon_1: <SlidersHorizontal color="white" className='w-5 h-5  my-[-16px] ' />,
    label_1: 'Chất lượng',
    icons_2: <ChevronRight color="white" className='w-5 h-5  my-[-16px] ' />,
    label_2: 'Tự động'
  },
]
