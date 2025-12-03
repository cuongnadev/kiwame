"use client";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale"; // Thêm locale tiếng Việt
import { Heart, MessageCircle, Pin, Gift } from "lucide-react";
import Image from "next/image";
import React from "react";

export interface Comment {
  id: string;
  author: string;
  avatar?: string; // optional vì có thể fallback
  content: string;
  time: Date;
  likes: number;
  liked: boolean;
  pinned?: boolean;
  gift?: boolean;
  replies?: number;
  isSpam?: boolean;
}

export default function LiveChatItem({ comment }: { comment: Comment }) {
  const timeAgo = formatDistanceToNow(comment.time, {
    addSuffix: true,
    locale: vi, // "5 phút trước", "vừa xong"...
  });

  return (
    <div
      className={`group rounded-xl p-3 transition-all duration-200 hover:bg-white/10 ${
        comment.pinned ? "bg-yellow-500/10 border border-yellow-500/30" : ""
      } ${comment.gift ? "bg-purple-900/20 border border-purple-500/50" : ""} ${
        comment.isSpam ? "opacity-60" : ""
      }`}
    >
      {/* Pinned badge */}
      {comment.pinned && (
        <div className="flex items-center gap-1.5 text-yellow-400 text-xs font-bold mb-2">
          <Pin className="w-3.5 h-3.5 fill-yellow-400" />
          Đã ghim
        </div>
      )}

      {/* Gift badge */}
      {comment.gift && (
        <div className="flex items-center gap-1.5 text-purple-400 text-xs font-bold mb-2">
          <Gift className="w-4 h-4" />
          Super Chat
        </div>
      )}

      <div className="flex gap-3">
        {/* Avatar */}
        <div className="shrink-0">
          {comment.avatar ? (
            <Image
              src={comment.avatar}
              alt={comment.author}
              width={36}
              height={36}
              className="rounded-full object-cover border border-white/20"
            />
          ) : (
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-sm font-bold text-white">
              {comment.author[0].toUpperCase()}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-white text-sm">
              {comment.author}
            </span>
            <span className="text-xs text-gray-400">
              {timeAgo.replace("khoảng ", "").replace("hơn ", "")}
            </span>
          </div>

          <p className="text-sm text-gray-100 mt-0.5 break-words">
            {comment.content}
          </p>

          {/* Actions */}
          <div className="flex items-center gap-4 mt-2 text-xs">
            <button className="flex items-center gap-1 text-gray-400 hover:text-red-500 transition">
              <Heart
                className={`w-4 h-4 ${comment.liked ? "fill-red-500 text-red-500" : ""}`}
              />
              {comment.likes > 0 && comment.likes.toLocaleString("vi-VN")}
            </button>

            {comment.replies && comment.replies > 0 && (
              <button className="flex items-center gap-1 text-gray-400 hover:text-blue-500 transition">
                <MessageCircle className="w-4 h-4" />
                {comment.replies}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

