import {useMemo} from "react";
import {usePathname} from "next/navigation";
import {signOut} from "next-auth/react";
import {LogOut, MessageCircle, User2} from "lucide-react";

import useConversation from "./useConversation";

const useRoutes = () => {
  const pathname = usePathname();
  const {conversationId} = useConversation();

  const routes = useMemo(
    () => [
      {
        label: "Chat",
        href: "/conversations",
        icon: MessageCircle,
        active: pathname === "/conversations" || !!conversationId,
      },
      {
        label: "Profile",
        href: "/profile",
        icon: User2,
        active: pathname === "/profile",
      },
      {
        label: "Logout",
        href: "#",
        onClick: () => signOut(),
        icon: LogOut,
      },
    ],
    [pathname, conversationId]
  );

  return routes;
};

export default useRoutes;
