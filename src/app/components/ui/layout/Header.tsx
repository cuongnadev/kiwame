import {
  Menu, Bell, CircleUserRound, Plus, ChevronRight,
} from "lucide-react"
import { Button } from "../button/Button"
import Link from "next/link"
import Image from "next/image"
import logo from "@/assets/images/logo.png"
import logoText from "@/assets/images/logo_text.png"
import { Popup } from "../popup/Popup"
import { menuItems, miscMenuItems, nestedMenuItems } from "@/constants/menu.constants"
import { Search } from "../search/Search"
import { useRouter } from "next/navigation"

interface HeaderProps {
  onMenuClick: () => void,
  isLogin?: boolean,
}

export default function Header({ onMenuClick, isLogin }: HeaderProps) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/auth/logout', { method: 'POST' });
      const data = await res.json();

      if (data.success) {
        router.push('/login');
      } else {
        alert('Logout failed');
      }
    } catch (err) {
      console.error(err);
      alert('Something went wrong.');
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0f0f0f] px-4.5 py-3">
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
              <Image
                src={logoText}
                width={200}
                height={40}
                alt="Kiwame Text Logo"
                className="-translate-x-8"
              />
            </Link>
          </div>
        </div>
        {/* Center */}
        <Search />
        {/* Right */}
        <div className="flex items-center gap-2">
          <Button
            icon={<Plus size={20} />}
            variant="dark"
            onClick={() => { }}
            radius="full"
            text="Tạo"
            className="py-2.5!"
          />
          <Button
            icon={<Bell size={20} />}
            variant="ghost"
            onClick={() => { }}
            radius="full"
            className="p-3!"
          />
          {isLogin &&
            <Popup
              trigger={
                <Button
                  icon={<CircleUserRound size={20} />}
                  variant="dark"
                  onClick={() => { }}
                  radius="full"
                  className="p-3!"
                />
              }
              position="menu-left"
            >
              <div className="p-2 text-white space-y-1 w-60">

                {/* Info */}
                <div className="px-3 py-2 border-b border-white/10">
                  <p className="font-semibold">Tên người dùng</p>
                  <p className="text-sm text-gray-400">email@gmail.com</p>
                </div>

                {/* Section 1 */}
                {menuItems.map((item, i) => {
                  if (item.label === "Đăng xuất") {
                    return (
                      <div
                        key={i}
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-3 py-2 hover:bg-white/10 rounded-lg"
                      >
                        {item.icon}
                        <span>{item.label}</span>
                      </div>
                    )
                  } else {
                    return (
                      <Link
                        key={i}
                        href={item.href}
                        className="flex items-center gap-3 px-3 py-2 hover:bg-white/10 rounded-lg"
                      >
                        {item.icon}
                        <span>{item.label}</span>
                      </Link>
                    )
                  }
                })}

                {/* Section 2 (nested popup items) */}
                {nestedMenuItems.map((item, i) => (
                  <Popup
                    key={i}
                    position="left"
                    trigger={
                      <div className="flex items-center gap-3 px-3 py-2 hover:bg-white/10 rounded-lg cursor-pointer">
                        {item.icon}
                        <span>{item.label}</span>
                        {item.showChevron &&
                          <ChevronRight size={16} className="ml-auto text-gray-400" />
                        }
                      </div>
                    }
                  >
                    <div className="p-2 space-y-1">
                      {item.children.map((child, idx) => (
                        <div
                          key={idx}
                          className="px-3 py-2 hover:bg-white/10 rounded-md cursor-pointer"
                        >
                          {child.label}
                        </div>
                      ))}
                    </div>
                  </Popup>
                ))}

                {/* Section 3 */}
                {miscMenuItems.map((item, i) => (
                  <Link
                    key={i}
                    href={item.href}
                    className="flex items-center gap-3 px-3 py-2 hover:bg-white/10 rounded-lg"
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>
                ))}

              </div>

            </Popup>
          }
          {!isLogin &&
            <Button
              icon={<CircleUserRound size={20} />}
              variant="dark"
              onClick={() => { }}
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
