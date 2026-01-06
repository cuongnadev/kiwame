import "@/app/globals.css";
import { Meta, StoryObj } from "@storybook/nextjs-vite";
import { VideoPreviewCard } from "./VideoPreviewCard";

const meta: Meta<typeof VideoPreviewCard> = {
  title: 'Components/VideoPreviewCard',
  component: VideoPreviewCard,
  tags: ['autodocs'],
  argTypes: {
    videoId: {
      control: 'text',
      description: 'Kiwame video id',
    },
    title: {
      control: 'text',
      description: 'Video title',
    },
    channel: {
      control: 'text',
    },
    views: {
      control: 'text',
    },
    publishedAt: {
      control: 'text',
    },
    duration: {
      control: 'text',
    },
    thumbnailUrl: {
      control: 'text',
    },
  },
};

export default meta;

type Story = StoryObj<typeof VideoPreviewCard>;

export const Default: Story = {
  render: () => (
    <div className="w-full grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-6 p-6 bg-gray-50">
      <VideoPreviewCard
        videoId="vXoXmV7CEyI"
        title="Lạc Vào Khu Rừng Hoa - Nắng Ấm Trong Tim - NHẠC REMIX TIKTOK TRIỆU VIEW, Top 20 Nhạc TikTok Hay 2025"
        channel="BD Media Music"
        duration="49:30"
        publishedAt="2 ngày trước"
        views="103 N lượt xem"
        thumbnailUrl="https://i.ytimg.com/vi/a4K_P5uqlrE/hqdefault.jpg?sqp=-oaymwEnCPYBEIoBSFryq4qpAxkIARUAAIhCGAHYAQHiAQoIGBACGAY4AUAB&rs=AOn4CLBtzaNewlRj0DsH72O2oTZYPTykPg"
      />
      <VideoPreviewCard
        videoId="vXoXmV7CEyI"
        title="ALL IN ONE | Học Sinh Mạnh Nhất Trường Học Ma Pháp | Review Anime Ha"
        channel="Bo Kin Backup"
        duration="49:30"
        publishedAt="3 tháng trước"
        views="552 N lượt xem"
        thumbnailUrl="https://i.ytimg.com/vi/vXoXmV7CEyI/hq720.jpg?sqp=-oaymwEnCNAFEJQDSFryq4qpAxkIARUAAIhCGAHYAQHiAQoIGBACGAY4AUAB&rs=AOn4CLBcyMR909QKOiCt9P0IOMeDnXIJUQ"
      />
      <VideoPreviewCard
        videoId="vXoXmV7CEyI"
        title="PUBG PC I AL_Himass #79 I Game đấu bùng nổ của Himass"
        channel="Pro Player VN"
        duration="49:30"
        publishedAt="1 tháng trước"
        views="31 N lượt xem"
        thumbnailUrl="https://i.ytimg.com/vi/r-GR_5DMIqU/hq720.jpg?sqp=-oaymwEnCNAFEJQDSFryq4qpAxkIARUAAIhCGAHYAQHiAQoIGBACGAY4AUAB&rs=AOn4CLD8joMnBaMhdQbfWH0KNs19CTYf3A"
      />
    </div>
  ),
};

