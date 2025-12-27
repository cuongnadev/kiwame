'use client';

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from '@/app/components/ui/button/Button';
import { Input } from '@/app/components/ui/input/Input';
import { LockKeyhole, User, UploadCloud } from 'lucide-react';
import { useToast } from '@/app/components/ui/toast/ToastContext';
import { getFirstZodError } from '@/helper/get-first-zod-error';

export default function CompleteProfileForm() {
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const inputRef = useRef<HTMLInputElement | null>(null);
  const router = useRouter();

  const handlePickFile = () => {
    inputRef.current?.click();
  };

  const handleFileChange = (file: File) => {
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileChange(file);
  };

  const handleSubmit = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('username', username);
      formData.append('full_name', fullName);

      if (avatarFile) {
        formData.append('avatar', avatarFile);
      }

      const res = await fetch('/api/profile', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      if (!res.ok) {
        const data = await res.json();
        const message = getFirstZodError(data.error);

        showToast(
          message ?? 'Profile completion failed',
          'error'
        );
        return;
      }

      showToast(
        'Profile completed successfully!',
        'success'
      );
      router.push('/');
    } catch (err) {
      console.error(err);
      showToast(
        'Unable to connect to the server. Please try again later.',
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center w-[420px] p-8 rounded-2xl bg-[#0f0f0f] border border-white/10 shadow-xl gap-6 text-gray-100">

      <div className="flex items-center justify-center">
        <Image src="/ms-icon-70x70.png" alt="logo" width={60} height={60} />
      </div>

      <div className="text-center">
        <h1 className="text-2xl font-semibold tracking-wide">Kiwame</h1>
        <p className="text-sm text-gray-400">Complete your profile</p>
      </div>

      <div className="text-center mb-1">
        <p className="text-xl font-semibold">Almost done!</p>
        <p className="text-sm text-gray-400">Tell us a bit about you</p>
      </div>

      <div className="w-full space-y-4">
        <Input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          prefix={<LockKeyhole className="text-gray-400" />}
          className="!border-none !outline-none bg-white/5 text-gray-100 placeholder-gray-400"
          required
        />

        <Input
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Full Name"
          prefix={<User className="text-gray-400" />}
          className="!border-none !outline-none bg-white/5 text-gray-100 placeholder-gray-400"
          required
        />

        <div
          onClick={handlePickFile}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="relative flex flex-col items-center justify-center w-full h-[140px] border-2 border-dashed border-white/20 rounded-xl cursor-pointer hover:border-purple-400 transition bg-white/5"
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileChange(file);
            }}
          />

          {avatarPreview ? (
            <Image
              src={avatarPreview}
              alt="avatar preview"
              width={112}
              height={112}
              className="w-28 h-28 object-cover rounded-full border border-white/20"
            />
          ) : (
            <>
              <UploadCloud className="w-8 h-8 text-gray-400 mb-2" />
              <p className="text-sm text-gray-400">
                Click hoặc kéo thả ảnh avatar
              </p>
            </>
          )}
        </div>
      </div>

      <Button
        onClick={handleSubmit}
        text="Complete Profile"
        className="w-full bg-purple-500 hover:bg-purple-600 text-white"
        disabled={!username || !fullName || loading}
      />
    </div>
  );
}
