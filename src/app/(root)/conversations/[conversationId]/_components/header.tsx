"use client";

import {useMemo} from "react";
import Link from "next/link";
import {ChevronLeft} from "lucide-react";

import useOtherUser from "@/hooks/useOtherUser";
import useActiveList from "@/hooks/useActiveList";
import {Conversation, User} from "@/generated/prisma";
import AvatarGroup from "@/app/_components/avatar-group";
import Avatar from "@/app/_components/avatar";

import ProfileDrawer from "./profile-drawer";

interface HeaderProps {
  conversation: Conversation & {
    users: User[];
  };
}

const Header = ({conversation}: HeaderProps) => {
  const otherUser = useOtherUser(conversation);

  const {members} = useActiveList();

  const isActive = members.indexOf(otherUser?.email) !== -1;

  const statusText = useMemo(() => {
    if (conversation.isGroup) {
      return `${conversation.users.length} members`;
    }

    return isActive ? "Active" : "Offline";
  }, [conversation, isActive]);

  return (
    <div className="bg-white w-full flex border-b-[1px] sm:px-4 py-3 px-4 lg:px-6 justify-between items-center shadow-sm">
      <div className="flex gap-3 items-center">
        <Link
          className="text-cyan-500 hover:text-cyan-600 transition cursor-pointer"
          href="/conversations"
        >
          <ChevronLeft size={32} />
        </Link>
        {conversation.isGroup ? (
          <AvatarGroup users={conversation.users} />
        ) : (
          <Avatar user={otherUser} />
        )}
        <div className="flex flex-col">
          <div>{conversation.name || otherUser?.name || otherUser?.email}</div>
          <div className="text-sm font-light text-neutral-500">
            {statusText}
          </div>
        </div>
      </div>
      <ProfileDrawer data={conversation} />
    </div>
  );
};
export default Header;
