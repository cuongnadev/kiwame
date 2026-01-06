import { useRouter } from "next/navigation";

import { useToast } from "@/hooks/useToast";
import { AppUser } from "@/hooks/useAppUser";
import { AppUserChannel } from "@/types/channel";
import { MenuItem, canAccess } from "@/constants/menu.constants";

export const useMenuNavigation = (
  user: AppUser | null,
  channel: AppUserChannel | null,
  openCreateChannel?: () => void,
) => {
  const router = useRouter();
  const { showToast } = useToast();

  const navigate = (itemOrHref: MenuItem | string) => {
    let href: string | undefined;
    let item: MenuItem | undefined;

    if (typeof itemOrHref === "string") {
      href = itemOrHref;
    } else {
      item = itemOrHref;
      href = item.href;
      const { allowed, modal } = canAccess(item, user, channel);
      if (!allowed) {
        if (modal === "createChannel") {
          showToast("You need to create a channel to use this feature.", "warning");
          if (openCreateChannel) {
            openCreateChannel();
          } else {
            router.push("/?openCreateChannel=true");
          }
        }
        if (modal === "login") router.push("/login");
        return;
      }
    }

    if (href) {
      router.push(href);
    }
  };

  return navigate;
};
