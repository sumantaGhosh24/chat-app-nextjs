"use client";

import {useCallback, useMemo} from "react";
import {useRouter} from "next/navigation";
import Link from "next/link";
import {useSession} from "next-auth/react";
import {formatDistanceToNowStrict} from "date-fns";

import {FullConversationType} from "@/types";
import useOtherUser from "@/hooks/useOtherUser";
import {SidebarMenuButton, SidebarMenuItem} from "@/components/ui/sidebar";
import AvatarGroup from "@/app/_components/avatar-group";
import Avatar from "@/app/_components/avatar";

interface ConversationBoxProps {
  conversation: FullConversationType;
  selected: boolean;
}

const ConversationBox = ({conversation, selected}: ConversationBoxProps) => {
  const otherUser = useOtherUser(conversation);

  const router = useRouter();
  const session = useSession();

  const handleClick = useCallback(() => {
    router.push(`/conversations/${conversation.id}`);
  }, [conversation.id, router]);

  const lastMessage = useMemo(() => {
    const messages = conversation.messages || [];
    return messages[messages.length - 1];
  }, [conversation.messages]);

  const userEmail = useMemo(() => {
    return session.data?.user?.email;
  }, [session.data?.user?.email]);

  const hasSeen = useMemo(() => {
    if (!lastMessage) return false;

    const seenArray = lastMessage.seen || [];

    if (!userEmail) return false;

    return seenArray.filter((user) => user.email === userEmail).length !== 0;
  }, [lastMessage, userEmail]);

  const lastMessageText = useMemo(() => {
    if (lastMessage?.imageUrl) {
      return "Sent an image";
    }

    if (lastMessage?.body) {
      return lastMessage.body;
    }

    return "Started a chat...";
  }, [lastMessage]);

  return (
    <SidebarMenuItem className="my-1">
      <SidebarMenuButton asChild isActive={selected} onClick={handleClick}>
        <div className="flex items-center cursor-pointer">
          {conversation.isGroup ? (
            <AvatarGroup users={conversation.users} />
          ) : (
            <Avatar user={otherUser} size="sm" />
          )}
          <div className="flex flex-col">
            <div className="flex items-center">
              <span className="font-bold capitalize">
                {conversation.name || otherUser.name}
              </span>
              {lastMessage?.createdAt && (
                <span>
                  {formatDistanceToNowStrict(lastMessage.createdAt)} ago
                </span>
              )}
            </div>
            <span
              className={`${
                hasSeen ? "text-gray-500" : "text-black font-medium"
              }`}
            >
              {lastMessageText}
            </span>
          </div>
        </div>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};
export default ConversationBox;
