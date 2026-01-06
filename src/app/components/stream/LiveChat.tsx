"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Send, MoreVertical } from "lucide-react";

import LiveChatItem, { Comment } from "@/app/components/stream/LiveChatItem";
import { Button, Input } from "@/app/components/ui";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { useToast } from "@/hooks/useToast";

interface LiveChatProps {
  stream: { id: string };
}

interface ProfileCache {
  [userId: string]: {
    name: string;
    avatar?: string;
  };
}

export default function LiveChat({ stream }: LiveChatProps) {
  const supabase = createSupabaseBrowserClient();
  const { showToast } = useToast();

  const [comments, setComments] = useState<Comment[]>([]);
  const [input, setInput] = useState("");
  const profileCacheRef = useRef<ProfileCache>({});
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const messageIdsRef = useRef<Set<string>>(new Set());
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setCurrentUserId(data.user?.id ?? null);
    });
  }, []);

  const send = async () => {
    if (!input.trim()) return;

    const message = input.trim();
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

  const getProfile = useCallback(
    async (userId: string) => {
      if (profileCacheRef.current[userId]) {
        return profileCacheRef.current[userId];
      };

      const { data, error } = await supabase
        .from("profiles")
        .select("full_name, avatar_url")
        .eq("id", userId)
        .single();

      const profile = {
        name: data?.full_name ?? "User",
        avatar: data?.avatar_url,
      };

      profileCacheRef.current[userId] = profile;
      return profile;
    },
    [supabase],
  );

  useEffect(() => {
    if (!currentUserId) return;

    const fetchInitialMessages = async () => {
      const { data, error } = await supabase
        .from("stream_chat")
        .select("*")
        .eq("stream_id", stream.id)
        .order("sent_at", { ascending: true })
        .limit(100);

      if (error) {
        showToast("Không tải được tin nhắn", "error");
        console.error(error);
        return;
      }

      const userIds = Array.from(
        new Set(data.map((m) => m.user_id).filter(Boolean))
      );

      const profiles: ProfileCache = {};
      await Promise.all(
        userIds.map(async (id) => {
          profiles[id] = await getProfile(id);
        }),
      );

      const chatIds = data.map((m) => m.id);
      const { data: likedRows, error: likeError } = await supabase
        .from("stream_chat_likes")
        .select("chat_id")
        .eq("user_id", currentUserId)
        .in("chat_id", chatIds);

      const likedSet = new Set(likedRows?.map((l) => l.chat_id));

      setComments(
        data.map((c) => {
          messageIdsRef.current.add(c.id.toString());
          const profile = c.user_id ? profiles[c.user_id] : null;

          return {
            id: c.id.toString(),
            author: profile?.name ?? "User",
            avatar: profile?.avatar ?? "https://avatar.iran.liara.run/public",
            content: c.message,
            time: new Date(c.sent_at),
            likes: c.likes ?? 0,
            liked: likedSet.has(c.id),
            pinned: c.pinned,
            gift: c.is_gift,
            isSpam: c.is_spam,
          };
        }),
      );
    };

    fetchInitialMessages();
  }, [stream.id, currentUserId]);

  useEffect(() => {
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
        async ({ new: c }) => {
          console.log("REALTIME MESSAGE:", c);
          console.log("REALTIME user_id:", c.user_id);

          if (messageIdsRef.current.has(c.id.toString())) return;
          messageIdsRef.current.add(c.id.toString());

          const profile = c.user_id ? await getProfile(c.user_id) : null;

          setComments((prev) => [
            ...prev,
            {
              id: c.id.toString(),
              author: profile?.name ?? "User",
              avatar: profile?.avatar ?? "https://avatar.iran.liara.run/public",
              content: c.message,
              time: new Date(c.sent_at),
              likes: c.likes ?? 0,
              liked: false,
              pinned: c.pinned,
              gift: c.is_gift,
              isSpam: c.is_spam,
            },
          ]);
        },
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "stream_chat",
          filter: `stream_id=eq.${stream.id}`,
        },
        ({ new: c }) => {
          console.log("REALTIME MESSAGE:", c);

          setComments((prev) =>
            prev.map((m) =>
              m.id === c.id.toString() ? { ...m, likes: c.likes } : m,
            ),
          );
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [stream.id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [comments]);

  const toggleLike = async (chatId: string, liked: boolean) => {
    if (!currentUserId) return;
    const id = Number(chatId);

    setComments((prev) =>
      prev.map((c) =>
        c.id === chatId
          ? {
            ...c,
            liked: !liked,
            likes: liked ? Math.max(c.likes - 1, 0) : c.likes + 1,
          }
          : c
      )
    );

    try {
      if (liked) {
        await supabase.from("stream_chat_likes").delete().match({
          chat_id: id,
          user_id: currentUserId,
        });
        await supabase.rpc("decrement_chat_like", { chat_id: id });
      } else {
        await supabase.from("stream_chat_likes").insert({
          chat_id: id,
          user_id: currentUserId,
        });
        await supabase.rpc("increment_chat_like", { chat_id: id });
      }
    } catch {
      showToast("Không thể like", "error");
    }
  };

  return (
    <aside className="w-full h-full flex flex-col bg-[#181818] border-l border-[#303030]">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-[#303030]">
        <div>
          <h3 className="font-semibold text-white">Trò chuyện trực tiếp</h3>
          <p className="text-xs text-gray-400">{comments.length} tin nhắn</p>
        </div>
        <button className="p-2 hover:bg-white/10 rounded-full transition">
          <MoreVertical className="w-5 h-5 text-gray-400" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {comments.map((c) => (
          <LiveChatItem
            key={c.id}
            comment={c}
            onLike={() => toggleLike(c.id, c.liked)}
          />
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
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
