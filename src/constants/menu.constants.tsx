import logo from "@/assets/images/logo.png"
import { SpeedCycleIcon } from "@/app/components/ui/icons/SpeedCycleIcon";
import {
  UserRound, LogOut, Database,
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
  SlidersHorizontal,
  SquareUser,
  LayoutDashboard,
  BadgeDollarSign,
  Camera
} from "lucide-react"
import Image from "next/image";
import { ReactNode } from "react";
import { YourVideoIcon } from "@/app/components/ui/icons/YourVideoIcon";
import { AnalyticsIcon } from "@/app/components/ui/icons/AnalyticsIcon";
import { AudienceIcon } from "@/app/components/ui/icons/AudienceIcon";
import { ListBulletIcon } from "@/app/components/ui/icons/ListBulletIcon";
import { RecordIcon } from "@/app/components/ui/icons/RecordIcon";
import { SparkIcon } from "@/app/components/ui/icons/SparkIcon";
import { MusicNoteSquareIcon } from "@/app/components/ui/icons/MusicNoteSquareIcon";
import { ManagerIcon } from "@/app/components/ui/icons/ManagerIcon";

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

export const getMenuItems = (channel: string): MenuItem[] => [
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
    icon: <Image src={logo} height={18} width={18} alt="Kiwame" />,
    label: "Kiwame Studio",
    href: `/studio/channel/${channel}`,
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

export const getMenuItemsWithStudio = (channel: string): MenuItem[] => [
  {
    icon: <SquareUser color="white" size={18} />,
    label: "Kênh của bạn",
    href: `/${channel}`,
  },
  {
    icon: <Image src={logo} height={18} width={18} alt="Kiwame" />,
    label: "Kiwame",
    href: `/`,
  },
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
    icon: <MessageSquareMore color="white" size={18} />,
    label: "Gửi ý kiến phản hồi",
    href: "/feedback",
  },
]

export const getStudioMenuItems = (channel: string): MenuItem[] => [
  { icon: <LayoutDashboard color="white" size={24} />, label: 'Tổng quan', href: `/studio/channel/${channel}` },
  { icon: <YourVideoIcon className="text-white" />, label: 'Nội dung', href: `/studio/channel/${channel}/upload` },
  { icon: <AnalyticsIcon className="text-white" />, label: 'Số liệu phân tích', href: `/studio/channel/${channel}/analytics` },
  { icon: <AudienceIcon className="text-white" />, label: 'Cộng đồng', href: `/studio/channel/${channel}/comments` },
  { icon: <ListBulletIcon className="text-white" />, label: 'Phụ đề', href: `/studio/channel/${channel}/translations` },
  { icon: <RecordIcon className="text-white" />, label: 'Phát hiện nội dung', href: `/studio/channel/${channel}/copyright` },
  { icon: <BadgeDollarSign color="white" size={24} />, label: 'Kiếm tiền', href: `/studio/channel/${channel}/monetization` },
  { icon: <SparkIcon className="text-white" />, label: 'Tùy chỉnh', href: `/studio/channel/${channel}/editing` },
  { icon: <MusicNoteSquareIcon className="text-white" />, label: 'Thư viện âm thanh', href: `/studio/channel/${channel}/music` },
]

export const getLiveMenuItems = (channel: string): MenuItem[] => [
  { icon: <Radio width={20} height={20} />, label: 'Phát trực tiếp', href: `/studio/channel/${channel}/livestreaming` },
  { icon: <Camera width={20} height={20} />, label: 'Webcam', href: `/studio/channel/${channel}/webcam` },
  { icon: <ManagerIcon className="text-white" />, label: 'Quản lý', href: `/studio/channel/${channel}/management` },
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

export const getStudioItems = (channel: string): MenuItem[] => [
  { icon: <SquarePlay width={20} height={20} />, label: 'Tải video lên', href: `/studio/channel/${channel}/upload` },
  { icon: <Radio width={20} height={20} />, label: 'Phát trực tiếp', href: `/studio/channel/${channel}/livestreaming` },
  { icon: <SquarePen width={20} height={20} />, label: 'Tạo bài đăng', href: `/${channel}/post` },
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
