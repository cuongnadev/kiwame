"use client";

import clsx from "clsx";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useRef, useState } from "react";
import { Tv, UploadCloud, X, Image as ImageIcon } from "lucide-react";
import { Input, Button } from "@/app/components/ui";
import { useToast } from "@/hooks/useToast";
import { useAppUser } from "@/hooks/useAppUser";
import { getFirstZodError } from "@/helper/get-first-zod-error";

export interface CreateChannelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateChannelModal({
  open,
  onOpenChange,
}: CreateChannelProps) {
  const [channelName, setChannelName] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();
  const { refetch } = useAppUser();

  const avatarRef = useRef<HTMLInputElement | null>(null);
  const bannerRef = useRef<HTMLInputElement | null>(null);
  const router = useRouter();

  if (!open) return null;

  const handlePickAvatar = () => avatarRef.current?.click();
  const handlePickBanner = () => bannerRef.current?.click();

  const handleFile = (
    file: File,
    setFile: React.Dispatch<React.SetStateAction<File | null>>,
    setPreview: React.Dispatch<React.SetStateAction<string | null>>
  ) => {
    setFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleDrog = (
    e: React.DragEvent<HTMLDivElement>,
    setFile: React.Dispatch<React.SetStateAction<File | null>>,
    setPreview: React.Dispatch<React.SetStateAction<string | null>>
  ) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file, setFile, setPreview);
  }

  const handleSubmit = async () => {

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('channelName', channelName);

      if (avatarFile) {
        formData.append('avatar', avatarFile);
      }

      if (bannerFile) {
        formData.append('banner', bannerFile);
      }

      const res = await fetch('/api/channel/create', {
        method: 'POST',
        body: formData,
      });

      if(!res.ok) {
        const data = await res.json();
        const message = getFirstZodError(data.error);
        showToast(
          message || 'Failed to create channel. Please check your input.',
          'error'
        );
        setLoading(false);
        return;
      }

      showToast(
        'Channel created successfully!',
        'success'
      );

      await refetch();

      handleCancel();
      router.push('/');
    } catch (err) {
      console.error(err);
      showToast(
        'Unable to connect to the server. Please try again later.',
        'error'
      );
      setLoading(false);
    }
  }

  const handleCancel = () => {
    setChannelName("");
    setAvatarPreview(null);
    setBannerPreview(null);
    setLoading(false);
    onOpenChange(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="relative w-full max-w-[460px] rounded-2xl border border-white/10 bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] p-6 shadow-2xl animate-in fade-in zoom-in">
        <Button
          icon={<X size={18} />}
          onClick={handleCancel}
          variant="dark"
          radius="full"
          className="absolute top-4 right-4 p-2! hover:bg-white/10"
        />

        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500/15 text-red-400">
            <Tv />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">
              Create Your Channel
            </h2>
            <p className="text-xs text-gray-400">
              Customize your public creator profile
            </p>
          </div>
        </div>

        <div className="space-y-5">
          <Input
            value={channelName}
            placeholder="Your channel name"
            prefix={<Tv className="text-gray-400" />}
            onChange={(e) => {
              let value = e.target.value.trim();
              if (value && !value.startsWith('@')) {
                value = '@' + value;
              }

              setChannelName(value);
            }}
            required
          />

          <div
            onClick={handlePickAvatar}
            onDrop={(e) => handleDrog(e, setAvatarFile, setAvatarPreview)}
            onDragOver={(e) => e.preventDefault()}
            className={clsx(
              "group relative flex h-[140px] w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed bg-white/5 transition",
              avatarPreview
                ? "border-white/20"
                : "border-white/15 hover:border-purple-400"
            )}
          >
            <input
              ref={avatarRef}
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFile(file, setAvatarFile, setAvatarPreview);
              }}
            />

            {avatarPreview ? (
              <Image
                src={avatarPreview}
                alt="avatar preview"
                width={112}
                height={112}
                className="h-28 w-28 rounded-full object-cover ring-2 ring-purple-400/40"
              />
            ) : (
              <>
                <ImageIcon className="mb-2 h-8 w-8 text-gray-400 group-hover:text-purple-400 transition" />
                <p className="text-sm text-gray-400">
                  Upload channel avatar
                </p>
              </>
            )}
          </div>

          <div
            onClick={handlePickBanner}
            onDrop={(e) => handleDrog(e, setBannerFile, setBannerPreview)}
            onDragOver={(e) => e.preventDefault()}
            className={clsx(
              "group relative flex h-[140px] w-full cursor-pointer items-center justify-center rounded-xl border-2 bg-white/5 transition",
              bannerPreview
                ? "border-white/20"
                : "border-dashed border-white/15 hover:border-purple-400"
            )}
          >
            <input
              ref={bannerRef}
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFile(file, setBannerFile, setBannerPreview);
              }}
            />

            {bannerPreview ? (
              <Image
                src={bannerPreview}
                alt="banner preview"
                width={600}
                height={240}
                className="h-full w-full rounded-xl object-cover"
              />
            ) : (
              <div className="text-center">
                <UploadCloud className="mx-auto mb-2 h-8 w-8 text-gray-400 group-hover:text-purple-400 transition" />
                <p className="text-sm text-gray-400">
                  Upload channel banner
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <Button
            text="Cancel"
            variant="ghost"
            className="w-full"
            onClick={handleCancel}
          />

          <Button
            text={loading ? "Creating..." : "Create Channel"}
            className="w-full"
            onClick={handleSubmit}
            disabled={!channelName || loading}
          />
        </div>
      </div>
    </div>
  );
}
