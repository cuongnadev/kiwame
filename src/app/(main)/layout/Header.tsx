"use client";

import { Menu, Plus, Bell, CircleUserRound } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/app/components/ui/button/Button";
import { Popup } from "@/app/components/ui/popup/Popup";
import { Search } from "@/app/components/ui/search/Search";
import { UserMenu } from "./UserMenu";
import logo from "@/assets/images/logo.png";
import logoText from "@/assets/images/logo_text.png";
import { getCreateMenuItems, getUserDropdownMenu } from "@/constants/menu.constants";
import { useMenuNavigation } from "@/hooks/useMenuNavigation";
import { AppUser } from "@/hooks/useAppUser";
import clsx from "clsx";
import { useToast } from "@/app/components/ui/toast/ToastContext";
import { useRouter } from "next/navigation";

interface HeaderProps {
  onMenuClick: () => void;
  user: AppUser | null;
  channel: string | null;
  openCreateChannel?: () => void;
  className?: string;
  type: "main" | "studio";
}

export default function Header({
  onMenuClick,
  user,
  channel,
  openCreateChannel,
  className,
  type,
}: HeaderProps) {
  const router = useRouter();
  const { showToast } = useToast();

  const navigate = useMenuNavigation(user, channel, openCreateChannel);

  const createItems = getCreateMenuItems(channel);
  const userMenuItems = getUserDropdownMenu(channel);

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/auth/logout', {
        headers: { 'Content-Type': 'application/json' },
        method: 'POST'
      });
      const data = await res.json();

      if (!data.success) {
        showToast('Logout failed. Please try again.', 'error');
        return;
      }

      showToast('Logged out successfully.', 'success');
      router.push('/login');
    } catch (err) {
      console.error(err);
      showToast(
        'Unable to log out. Please try again later.',
        'error'
      );
    }
  };

  return (
    <header className={clsx(className, "sticky top-0 z-50 bg-[#0f0f0f] px-4 py-3 border-b border-white/10 backdrop-blur-xl")}>
      <div className="flex items-center justify-between gap-6">

        <div className="flex items-center gap-4">
          <Button onClick={onMenuClick} icon={<Menu size={24} />} variant="ghost" radius="full" className="p-2.5! hover:bg-white/10" />
          <Link href="/" className="flex items-center gap-4">
            <Image src={logo} width={44} height={44} alt="Kiwame" className="drop-shadow-md" />
            {type === "main" ? <Image src={logoText} width={200} height={40} alt="Kiwame" className="m-[-30px] hidden sm:block" /> : <span className="text-2xl font-semibold">Studio</span>}
          </Link>
        </div>

        <div className="flex-1 max-w-3xl mx-4">
          <Search />
        </div>

        <div className="flex items-center gap-3">

          <Popup trigger={
            <Button icon={<Plus size={22} />} text="Tạo" variant="dark" radius="full" className="px-4.5! py-2.5! font-medium shadow-lg hover:shadow-xl" />
          } position="bottom">
            <div className="w-64 bg-[#1a1a1a] rounded-lg border border-white/10 p-2">
              <div className="space-y-1">
                {createItems.map((item) => (
                  <div
                    key={item.label}
                    onClick={() => navigate(item)}
                    className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-white/10 cursor-pointer transition-all group"
                  >
                    <div className="text-white/80 group-hover:text-white">{item.icon}</div>
                    <span className="font-medium">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </Popup>

          <Button icon={<Bell size={22} />} variant="ghost" radius="full" className="p-3! hover:bg-white/10" />

          {user ? (
            <Popup trigger={
              <Image
                src={user.avatar_url || "https://avatar.iran.liara.run/public"}
                width={44}
                height={44}
                alt="Avatar"
                className="rounded-full ring-2 ring-white/20 hover:ring-white/40 cursor-pointer transition-all"
                unoptimized
              />
            } position="bottom-left">
              <UserMenu
                items={userMenuItems}
                onNavigate={navigate}
                user={user}
                channel={channel}
                onLogout={handleLogout}
                onToGoChannel={() => channel && navigate(`/${channel}`)}
                type={type}
              />
            </Popup>
          ) : (
            <Button
              text="Đăng nhập"
              icon={<CircleUserRound size={20} />}
              variant="dark"
              radius="full"
              className="px-5 py-2.5 font-medium"
              onClick={() => navigate("/login")}
            />
          )}
        </div>
      </div>
    </header>
  );
}
