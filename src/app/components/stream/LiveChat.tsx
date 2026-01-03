"use client";
import { useEffect, useRef, useState } from "react";
import { Send, MoreVertical } from "lucide-react";

import LiveChatItem, { Comment } from "@/app/components/stream/LiveChatItem";


const initialComments: Comment[] = [
  {
    id: "1",
    author: "Bé Na Cute",
    avatar: "https://yt3.ggpht.com/8OvO6JSUcP5YaxmKK5xJy71r79tKp58U14Rj34jG5CrE78-8sJjTlAzJe1EcKR5MySuf1MVK3s0=s88-c-k-c0x00ffffff-no-rj",
    content: "Anh ơi stream hay quá trời luôn áaaa ơi ơi",
    time: new Date(Date.now() - 1 * 60 * 1000),
    likes: 1234,
    liked: true,
    pinned: true,
  },
  {
    id: "2",
    author: "ProGamer99",
    avatar: "https://avatar.iran.liara.run/public/boy?username=progamer99",
    content: "Anh dùng SRS hay Nginx-RTMP vậy? Delay bao nhiêu ms thế anh?",
    time: new Date(Date.now() - 3 * 60 * 1000),
    likes: 89,
    liked: false,
  },
  {
    id: "3",
    author: "Gái Xinh 2k5",
    avatar: "https://avatar.iran.liara.run/public/girl?username=gaixinh2k5",
    content: "Em vừa follow anh nè ❤️❤️❤️",
    time: new Date(Date.now() - 5 * 60 * 1000),
    likes: 892,
    liked: true,
  },
  {
    id: "4",
    author: "Hater số 1",
    avatar: "https://avatar.iran.liara.run/public/boy?username=hater",
    content: "Chơi dở thế mà cũng stream à =))",
    time: new Date(Date.now() - 7 * 60 * 1000),
    likes: 12,
    liked: false,
    replies: 45,
  },
  {
    id: "6",
    author: "Đại Gia Lắm Tiền",
    avatar: "https://avatar.iran.liara.run/public/boy?username=daigia",
    content: "Gift 10 cái super chat cho anh em chill nào!!!",
    time: new Date(Date.now() - 12 * 60 * 1000),
    likes: 2341,
    liked: true,
    gift: true,
  },
  {
    id: "7",
    author: "Noob Master",
    avatar: "https://avatar.iran.liara.run/public/boy",
    content: "Ai cho mình xin config OBS với anh ơi, mình mới tập stream :<<",
    time: new Date(Date.now() - 15 * 60 * 1000),
    likes: 67,
    liked: false,
  },
  {
    id: "8",
    author: "Thanh Niên Cứng",
    avatar: "https://avatar.iran.liara.run/public/boy?username=thanhniencung",
    content: "Đỉnh cao của sự lầy lội luôn rồi đấy anh ơi 😂😂😂",
    time: new Date(Date.now() - 20 * 60 * 1000),
    likes: 789,
    liked: true,
  },
  {
    id: "9",
    author: "Fan Cứng 10 Năm",
    avatar: "https://avatar.iran.liara.run/public/girl?username=fan10nam",
    content: "Từ hồi anh còn 10 viewers em đã ở đây rồi đó nha 🥹",
    time: new Date(Date.now() - 25 * 60 * 1000),
    likes: 2103,
    liked: true,
  },
  {
    id: "10",
    author: "Bot Spam 247",
    avatar: "https://avatar.iran.liara.run/public/boy?username=bot",
    content: "Check link in bio để nhận giftcard miễn phí nhé các bạn!!!",
    time: new Date(Date.now() - 28 * 60 * 1000),
    likes: 3,
    liked: false,
    isSpam: true,
  },
];

export default function LiveChat() {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const send = () => {
    if (!input.trim()) return;
    const newComment: Comment = {
      id: Date.now().toString(),
      author: "Bạn",
      content: input,
      time: new Date(),
      likes: 0,
      liked: false,
    };
    setComments([newComment, ...comments]);
    setInput("");
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [comments]);

  return (
    <aside className="w-full h-full flex flex-col bg-[#181818] border-l border-[#303030] group/sidebar">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-[#303030] flex-shrink-0">
        <div>
          <h3 className="font-semibold text-white">Trò chuyện trực tiếp</h3>
          <p className="text-xs text-gray-400">{comments.length} tin nhắn</p>
        </div>
        <button className="p-2 hover:bg-white/10 rounded-full transition">
          <MoreVertical className="w-5 h-5 text-gray-400" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-hover">
        {comments.map((c, index) => (
          <LiveChatItem comment={c} key={index} />
        ))}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-[#303030]">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), send())}
            placeholder="Gửi tin nhắn..."
            className="flex-1 bg-[#303030] text-white placeholder-gray-500 rounded-full px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
          <button
            onClick={send}
            disabled={!input.trim()}
            className="p-2.5 rounded-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </aside>
  );
}
