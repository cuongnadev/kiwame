import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // YouTube channel avatars (yt3.ggpht.com)
      {
        protocol: "https",
        hostname: "yt3.ggpht.com",
      },
      // YouTube video thumbnails
      {
        protocol: "https",
        hostname: "i.ytimg.com",
      },
      // Backup thumbnail domain cũ của YouTube
      {
        protocol: "https",
        hostname: "img.youtube.com",
      },
      // Avatar giả lập iran.liara.run (bạn đang dùng)
      {
        protocol: "https",
        hostname: "avatar.iran.liara.run",
        // pathname không bắt buộc ở đây vì domain này luôn trả về ảnh trực tiếp
      },
      // Bonus: Google user content (nếu sau này dùng Google avatar)
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },
};

export default nextConfig;
