import {
  Menu, Bell, CircleUserRound, Plus,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/app/components/ui/button/Button"
import logo from "@/assets/images/logo.png"
import logoText from "@/assets/images/logo_text.png"
import { Popup } from "@/app/components/ui/popup/Popup"
import { Search } from "@/app/components/ui/search/Search"
import { getMenuItems, getMenuItemsWithStudio, getStudioItems, MenuItem } from "@/constants/menu.constants"
import { UserMenu } from "./UserMenu"
import clsx from "clsx"
import { useState } from "react"
import { useToast } from "@/app/components/ui/toast/ToastContext"
import { AppUser } from "@/hooks/useAppUser"

interface HeaderProps {
  onMenuClick: () => void,
  user: AppUser | null,
  isStudio?: boolean,
  channel?: string | null,
  className?: string,
  isLive?: boolean,
}

export default function Header({ onMenuClick, user, isStudio = false, channel, className, isLive = true }: HeaderProps) {
  const router = useRouter();
  const [showCreateChannelModal, setShowCreateChannelModal] = useState<boolean>(false);
  const menuItems = getMenuItems(channel);
  const menuItemsStudio = getMenuItemsWithStudio(channel);
  const studioItems = getStudioItems(channel);
  const { showToast } = useToast();

  const openCreateChannelModal = () => {
    showToast(
      'You need to create a channel first.',
      'warning'
    );
    setShowCreateChannelModal(true);
  };

  const handleMenuClick = (item: MenuItem) => {
    if (!item.href) {
      openCreateChannelModal();
      return;
    }

    router.push(item.href);
  }

  const handleToGoChannel = () => {
    if (channel) {
      router.push(`/${channel}`);
    } else {
      openCreateChannelModal();
    }
  };

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
    <header className={clsx(className, `sticky top-0 z-40 w-full bg-[#0f0f0f] px-4.5 py-3 `)}>
      <div className="flex items-center justify-between gap-4">
        {/* Left */}
        <div className="flex items-center gap-4.5">
          <Button
            onClick={onMenuClick}
            text=""
            icon={<Menu size={20} />}
            variant="ghost"
            radius="full"
            className="p-3!"
          />
          <div className="flex items-center">
            <Link href={"/"} className="flex items-center justify-start">
              <Image
                src={logo}
                width={40}
                height={40}
                alt="Kiwame Logo"
              />
              {isStudio ? (
                <span className="text-white text-xl font-medium ml-2">Studio</span>
              ) : (
                <Image
                  src={logoText}
                  width={200}
                  height={40}
                  alt="Kiwame Text Logo"
                  className="-translate-x-8"
                />
              )}
            </Link>
          </div>
        </div>
        {/* Center */}
        {isLive && <Search />}
        {/* Right */}
        <div className="flex items-center gap-2">
          {isLive && (
            <>
              <Popup
                trigger={
                  <Button
                    icon={<Plus size={20} />}
                    variant="dark"
                    onClick={() => { }}
                    radius="full"
                    text="Tạo"
                    className="py-2.5!"
                  />
                }
                position="bottom"
                className="min-w-44!"
              >
                <div className="p-2 text-white space-y-1">
                  {/* Section 1 */}
                  {studioItems.map((item, i) => (
                    <div
                      key={i}
                      onClick={() => handleMenuClick(item)}
                      className="flex items-center gap-3 px-3 py-2 hover:bg-white/10 rounded-lg cursor-pointer"
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </div>
                  ))}
                </div>
              </Popup>

              {/* notifications */}
              <Button
                icon={<Bell size={20} />}
                variant="ghost"
                onClick={() => { }}
                radius="full"
                className="p-3!"
              />
            </>
          )}
          {/* user menu */}
          {user &&
            <Popup
              trigger={
                user.avatar_url ? (
                  <Image width={44} height={44} src={user.avatar_url} alt={`avatar-${user.username}`} unoptimized priority className="rounded-full cursor-pointer" />
                ) : (
                  <Button
                    icon={<CircleUserRound size={20} />}
                    variant="dark"
                    onClick={() => { }}
                    radius="full"
                    className="p-3!"
                  />
                )
              }
              position="bottom-left"
            >
              <UserMenu menu={isStudio ? menuItemsStudio : menuItems} onLogout={handleLogout} onToGoChannel={handleToGoChannel} onMenuClick={handleMenuClick} user={user} channel={channel} isStudio={isStudio} />
            </Popup>
          }
          {!user &&
            <Button
              icon={<CircleUserRound size={20} />}
              variant="dark"
              onClick={() => router.push('/login')}
              radius="full"
              text="Đăng nhập"
              className="py-2.5!"
            />
          }
        </div>
      </div>
    </header>
  )
}
