"use client";

import Image from "next/image";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Facebook, LockKeyhole, Mail } from "lucide-react";

import { useToast } from "@/hooks/useToast";
import { Button, Input, GoogleIcon } from "@/app/components/ui";
import { getFirstZodError } from "@/helper/get-first-zod-error";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();
  const router = useRouter();

  const handleLogin = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, rememberMe }),
      });

      if (!res.ok) {
        const data = await res.json();
        const message = getFirstZodError(data.error);
        showToast(message ?? "Login failed", "error");
        return;
      }

      showToast('Login successful! Redirecting...', 'success');
      router.push('/');
    } catch (err) {
      console.error(err);
      showToast('Unable to connect to the server. Please try again later.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const onSignUpClick = () => {
    router.push('/register');
  }

  return (
    <div className="flex flex-col items-center w-[420px] p-8 rounded-2xl bg-[#0f0f0f] border border-white/10 shadow-xl gap-6 text-gray-100">

      <div className="flex items-center justify-center">
        <Image src="/ms-icon-70x70.png" alt="logo" width={60} height={60} />
      </div>

      <div className="text-center">
        <h1 className="text-2xl font-semibold tracking-wide">Kiwame</h1>
        <p className="text-sm text-gray-400">Your premium streaming experience</p>
      </div>

      <div className="text-center mb-1">
        <p className="text-xl font-semibold">Welcome Back</p>
        <p className="text-sm text-gray-400">Login to your account</p>
      </div>

      <div className="w-full space-y-4">
        <Input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email address"
          prefix={<Mail className="text-gray-400" />}
          className="!border-none !outline-none bg-white/5 text-gray-100 placeholder-gray-400 focus:ring-purple-300"
        />

        <Input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="Password"
          prefix={<LockKeyhole className="text-gray-400" />}
          className="!border-none !outline-none bg-white/5 text-gray-100 placeholder-gray-400 focus:ring-purple-300"
          showPasswordToggle
        />
      </div>

      <div className="flex justify-between items-center w-full text-sm text-gray-300">
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            type="checkbox"
            className="accent-purple-400"
          />
          Remember me
        </label>
        <a href="#" className="text-purple-300 hover:text-purple-200 underline">
          Forgot password?
        </a>
      </div>

      <Button
        onClick={handleLogin}
        text="Sign in"
        className="w-full bg-purple-500 hover:bg-purple-600 text-white"
        disabled={!email || !password || loading}
      />

      <div className="flex items-center w-full gap-4 my-2">
        <div className="flex-1 h-[1px] bg-white/10"></div>
        <span className="text-gray-400 text-sm">Or continue with</span>
        <div className="flex-1 h-[1px] bg-white/10"></div>
      </div>

      <div className="flex items-center w-full gap-4">
        <Button variant="outline" icon={<GoogleIcon />} className="flex-1" />
        <Button variant="outline" icon={<Facebook />} className="flex-1" />
      </div>

      <p className="text-sm text-gray-300">
        Don&apos;t have an account?{" "}
        <span
          onClick={onSignUpClick}
          className="hover:underline text-purple-300 hover:text-purple-200 cursor-pointer"
        >
          Register
        </span>
      </p>
    </div>
  );
}
