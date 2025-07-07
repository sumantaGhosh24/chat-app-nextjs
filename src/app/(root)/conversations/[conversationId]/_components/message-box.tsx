"use client";

import Image from "next/image";
import {useSession} from "next-auth/react";
import clsx from "clsx";
import {format} from "date-fns";

import {FullMessageType} from "@/types";
import Avatar from "@/app/_components/avatar";

interface MessageBoxProps {
  isLast: boolean;
  data: FullMessageType;
}

const MessageBox = ({isLast, data}: MessageBoxProps) => {
  const session = useSession();

  const isOwn = session?.data?.user?.email === data.sender?.email;
  const seenList = (data.seen || [])
    .filter((user) => user.email !== session?.data?.user?.email)
    .map((user) => user.name)
    .join(", ");

  const container = clsx("flex items-center gap-3 p-4", isOwn && "justify-end");
  const avatar = clsx(isOwn && "order-2");
  const body = clsx("flex flex-col gap-2", isOwn && "items-end");
  const message = clsx(
    "text-sm w-fit overflow-hidden",
    isOwn ? "bg-cyan-500 text-white" : "bg-gray-100",
    data.imageUrl ? "rounded-md p-0" : "rounded-full py-2 px-3"
  );

  return (
    <div className={container}>
      <div className={avatar}>
        <Avatar user={data.sender} />
      </div>
      <div className={body}>
        <div className="flex items-center gap-1">
          <div className="text-sm text-gray-500">
            {data.sender?.name || data.sender?.email}
          </div>
          <div className="text-xs text-gray-400">
            {format(new Date(data.createdAt), "p")}
          </div>
        </div>
        <div className={message}>
          <span className="mb-2">{data.imageUrl}</span>
          {data.imageUrl ? (
            <Image
              src={data.imageUrl}
              width={288}
              height={288}
              alt="image"
              className="object-cover rounded"
            />
          ) : (
            <div>{data.body}</div>
          )}
        </div>
        {isLast && isOwn && seenList && (
          <div className="text-xs font-light text-gray-500">
            Seen by {seenList}
          </div>
        )}
      </div>
    </div>
  );
};
export default MessageBox;
