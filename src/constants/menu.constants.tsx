import Image from "next/image";
import { ReactNode } from "react";
import logo from "@/assets/images/logo.png";
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
import { YourVideoIcon, AnalyticsIcon, AudienceIcon, ListBulletIcon, RecordIcon, SparkIcon, MusicNoteSquareIcon, ManagerIcon, SpeedCycleIcon } from "@/app/components/ui/icons";
import { AppUser } from "@/hooks/useAppUser";
import { AppUserChannel } from "@/types/channel";

export type AccessRequirement = 'auth' | 'channel' | 'premium' | 'admin' | null;

export interface MenuChild {
  label: string;
  value: string;
}

export interface MenuItem {
  icon?: ReactNode;
  label: string;
  href?: string;
  require?: AccessRequirement | AccessRequirement[];
  fallbackModal?: 'createChannel' | 'login' | 'upgrade';
  showChevron?: boolean;
  children?: MenuChild[];
}

export const canAccess = (
  item: MenuItem,
  user: AppUser | null,
  channel: AppUserChannel | null,
): { allowed: boolean; modal?: string } => {
  if (!item.require) return { allowed: true };

  const reqs = Array.isArray(item.require) ? item.require : [item.require];

  for (const r of reqs) {
    if (r === 'auth' && !user) return { allowed: false, modal: 'login' };
    if (r === 'channel' && !channel) return { allowed: false, modal: 'createChannel' };
  }

  return { allowed: true };
};

// === MAIN MENU ===
export const mainMenuItems: MenuItem[] = [
  { icon: <Home size={24} />, label: "Trang chủ", href: "/" },
  { icon: <Zap size={24} />, label: "Shorts", href: "/shorts" },
  { icon: <TvMinimalPlay size={24} />, label: "Kênh đăng ký", href: "/subscriptions", require: 'auth' },
];

// === USER MENU (đã đăng nhập) ===
export const getUserMenuItems = (
  channel?: AppUserChannel | null): MenuItem[] => [
    { icon: <CircleUserRound size={24} />, label: "Bạn", href: "/account", showChevron: true },
    { icon: <ClockFading size={24} />, label: "Lịch sử xem", href: "/watch-later" },
    { icon: <ListVideo size={24} />, label: "Danh sách phát", href: "/playlists" },
    { icon: <SquarePlay size={24} />, label: "Video của bạn", href: channel ? `/studio/channel/${channel.name}/upload` : undefined, require: 'channel' },
    { icon: <Clock size={24} />, label: "Xem sau", href: "/playlists/watch-later" },
    { icon: <ThumbsUp size={24} />, label: "Video đã thích", href: "/playlists/liked" },
  ];

// === GUEST MENU ===
export const guestMenuItems: MenuItem[] = [
  { icon: <CircleUserRound size={24} />, label: "Đăng nhập để xem thêm", href: "/login" },
  { icon: <ClockFading size={24} />, label: "Lịch sử xem", href: "/watch-later" },
];

// === KHÁM PHÁ ===
export const exploreMenuItems: MenuItem[] = [
  { icon: <Music size={24} />, label: "Âm nhạc", href: "/music" },
  { icon: <Gamepad2 size={24} />, label: "Trò chơi", href: "/games" },
  { icon: <Newspaper size={24} />, label: "Tin tức", href: "/news" },
  { icon: <Trophy size={24} />, label: "Thể thao", href: "/sports" },
];

// === HỆ THỐNG ===
export const systemMenuItems: MenuItem[] = [
  { icon: <Settings size={24} />, label: "Cài đặt", href: "/settings" },
  { icon: <BadgeQuestionMark size={24} />, label: "Trợ giúp", href: "/help" },
  { icon: <MessageCircleReply size={24} />, label: "Gửi phản hồi", href: "/feedback" },
  { icon: <Flag size={24} />, label: "Nhật ký báo cáo", href: "/report-history" },
];

// === STUDIO MENU ===
export const getStudioMenuItems = (
  channel?: AppUserChannel | null): MenuItem[] => [
    { icon: <LayoutDashboard size={24} />, label: "Tổng quan", href: channel ? `/studio/channel/${channel.name}` : undefined, require: 'channel' },
    { icon: <YourVideoIcon className="w-6 h-6" />, label: "Nội dung", href: channel ? `/studio/channel/${channel.name}/upload` : undefined, require: 'channel' },
    { icon: <AnalyticsIcon className="w-6 h-6" />, label: "Số liệu phân tích", href: channel ? `/studio/channel/${channel.name}/analytics` : undefined, require: 'channel' },
    { icon: <AudienceIcon className="w-6 h-6" />, label: "Cộng đồng", href: channel ? `/studio/channel/${channel.name}/comments` : undefined, require: 'channel' },
    { icon: <ListBulletIcon className="w-6 h-6" />, label: "Phụ đề", href: channel ? `/studio/channel/${channel.name}/translations` : undefined, require: 'channel' },
    { icon: <RecordIcon className="w-6 h-6" />, label: "Phát hiện nội dung", href: channel ? `/studio/channel/${channel.name}/copyright` : undefined, require: 'channel' },
    { icon: <BadgeDollarSign size={24} />, label: "Kiếm tiền", href: channel ? `/studio/channel/${channel.name}/monetization` : undefined, require: 'channel' },
    { icon: <SparkIcon className="w-6 h-6" />, label: "Tùy chỉnh", href: channel ? `/studio/channel/${channel.name}/editing` : undefined, require: 'channel' },
    { icon: <MusicNoteSquareIcon className="w-6 h-6" />, label: "Thư viện âm thanh", href: channel ? `/studio/channel/${channel.name}/music` : undefined, require: 'channel' },
  ];

// === LIVESTREAM MENU ===
export const getLiveMenuItems = (
  channel?: AppUserChannel | null): MenuItem[] => [
    { icon: <Radio size={24} />, label: "Phát trực tiếp", href: channel ? `/studio/channel/${channel.name}/livestreaming` : undefined, require: 'channel' },
    { icon: <Camera size={24} />, label: "Webcam", href: channel ? `/studio/channel/${channel.name}/livestreaming/webcam` : undefined, require: 'channel' },
    { icon: <ManagerIcon className="w-6 h-6" />, label: "Quản lý", href: channel ? `/studio/channel/${channel.name}/livestreaming/management` : undefined, require: 'channel' },
  ];

// === NÚT TẠO (Create Button) ===
export const getCreateMenuItems = (
  channel?: AppUserChannel | null): MenuItem[] => [
    { icon: <SquarePlay size={20} />, label: "Tải video lên", href: channel ? `/studio/channel/${channel.name}/upload` : undefined, require: 'channel' },
    { icon: <Radio size={20} />, label: "Phát trực tiếp", href: channel ? `/studio/channel/${channel.name}/livestreaming` : undefined, require: 'channel' },
    { icon: <SquarePen size={20} />, label: "Tạo bài đăng", href: channel ? `/${channel.name}/posts` : undefined, require: 'channel' },
  ];

// === USER DROPDOWN MENU (Header) ===
export const getUserDropdownMenu = (
  channel?: AppUserChannel | null): MenuItem[] => [
    { icon: <SquareUser size={18} />, label: "Kênh của bạn", href: channel ? `/${channel.name}` : undefined, require: 'channel' },
    { icon: <UserRound size={18} />, label: "Chuyển đổi tài khoản", href: "/switch-account" },
    { icon: <LogOut size={18} />, label: "Đăng xuất", href: "/logout" },
    { icon: <Image src={logo} width={18} height={18} alt="Kiwame" />, label: "Kiwame", href: "/" },
    { icon: <Image src={logo} width={18} height={18} alt="Studio" />, label: "Kiwame Studio", href: channel ? `/studio/channel/${channel.name}` : undefined, require: 'channel' },
    {
      icon: <Database color="white" size={18} />,
      label: "Dữ liệu của bạn",
      href: "/your-data",
    },
    {
      icon: <Monitor size={18} />, label: "Giao diện thiết bị", showChevron: true, children: [
        { label: "Tối", value: "dark" },
        { label: "Sáng", value: "light" },
        { label: "Theo hệ thống", value: "system" },
      ]
    },
    {
      icon: <Languages size={18} />, label: "Ngôn ngữ", showChevron: true, children: [
        { label: "Tiếng Việt", value: "vi" },
        { label: "English", value: "en" },
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
    { icon: <Settings size={18} />, label: "Cài đặt", href: "/settings" },
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
  ];

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
