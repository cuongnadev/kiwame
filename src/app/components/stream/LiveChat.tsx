"use client";

import { useEffect, useRef, useState } from "react";
import { Send, MoreVertical } from "lucide-react";

import LiveChatItem, { Comment } from "@/app/components/stream/LiveChatItem";
import { Button, Input } from "@/app/components/ui";

import type { Database } from "@/lib/supabase/database.types";
import { useToast } from "@/hooks/useToast";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type Stream = Database["public"]["Tables"]["streams"]["Row"];

interface LiveChatProps {
  stream: Stream;
}

export default function LiveChat({ stream }: LiveChatProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const { showToast } = useToast();

  const send = async () => {
    if (!input.trim()) return;

    const message = input;
    setInput("");

    try {
      const res = await fetch("/api/live/chat/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          streamId: stream.id,
          message,
        }),
      });

      if (!res.ok) {
        showToast("Gửi tin nhắn thất bại", "error");
      }
    } catch {
      showToast("Lỗi kết nối", "error");
    }
  };

  useEffect(() => {
    const fetchInitialMessages = async () => {
      const supabase = createSupabaseBrowserClient();

      const { data, error } = await supabase
        .from("stream_chat")
        .select("*")
        .eq("stream_id", stream.id)
        .order("sent_at", { ascending: true })
        .limit(50);

      if (error) {
        showToast("Không tải được tin nhắn", "error");
        return;
      }

      setComments(
        data.map((c) => ({
          id: c.id.toString(),
          author: "User",
          content: c.message,
          time: new Date(c.sent_at),
          likes: c.likes ?? 0,
          liked: false,
          pinned: c.pinned,
          gift: c.is_gift,
          isSpam: c.is_spam,
        }))
      );
    };

    fetchInitialMessages();
  }, [stream.id, showToast]);

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();

    const channel = supabase
      .channel(`stream-chat-${stream.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "stream_chat",
          filter: `stream_id=eq.${stream.id}`,
        },
        (payload) => {
          console.log("🔥 REALTIME EVENT:", payload);
          const c = payload.new;

          setComments((prev) => {
            if (prev.some((p) => p.id === c.id.toString())) {
              return prev;
            }

            return [
              ...prev,
              {
                id: c.id.toString(),
                author: "User",
                content: c.message,
                time: new Date(c.sent_at),
                likes: c.likes ?? 0,
                liked: false,
                pinned: c.pinned,
                gift: c.is_gift,
                isSpam: c.is_spam,
              },
            ];
          });
        }
      )
      .subscribe((status) => {
        console.log("📡 CHANNEL STATUS:", status);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [stream.id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [comments]);

  return (
    <aside className="w-full h-full flex flex-col bg-[#181818] border-l border-[#303030]">
      <div className="flex items-center justify-between p-4 border-b border-[#303030]">
        <div>
          <h3 className="font-semibold text-white">Trò chuyện trực tiếp</h3>
          <p className="text-xs text-gray-400">{comments.length} tin nhắn</p>
        </div>
        <button className="p-2 hover:bg-white/10 rounded-full transition">
          <MoreVertical className="w-5 h-5 text-gray-400" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {comments.map((c) => (
          <LiveChatItem comment={c} key={c.id} />
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="p-4 border-t border-[#303030]">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onEnter={send}
            placeholder="Gửi tin nhắn..."
            clearable
            className="rounded-full!"
          />
          <Button
            icon={<Send className="w-5 h-5" />}
            onClick={send}
            disabled={!input.trim()}
            radius="full"
            className="p-2.5!"
          />
        </div>
      </div>
    </aside>
  );
}
