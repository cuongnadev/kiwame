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
  Flag
} from "lucide-react"

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
