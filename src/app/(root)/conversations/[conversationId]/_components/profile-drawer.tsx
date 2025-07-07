"use client";

import {useMemo} from "react";
import {format, formatDistanceToNowStrict} from "date-fns";
import {EllipsisIcon} from "lucide-react";

import useOtherUser from "@/hooks/useOtherUser";
import useActiveList from "@/hooks/useActiveList";
import {Conversation, User} from "@/generated/prisma";
import AvatarGroup from "@/app/_components/avatar-group";
import Avatar from "@/app/_components/avatar";
import DialogProvider from "@/app/(root)/_components/dialog-provider";

import ConfirmModal from "./confirm-modal";

interface ProfileDrawerProps {
  data: Conversation & {
    users: User[];
  };
}

const ProfileDrawer = ({data}: ProfileDrawerProps) => {
  const otherUser = useOtherUser(data);

  const {members} = useActiveList();

  const isActive = members.indexOf(otherUser?.email) !== -1;

  const joinedDate = useMemo(() => {
    return format(new Date(data.createdAt), "PP");
  }, [data.createdAt]);

  const title = useMemo(() => {
    if (data.isGroup) {
      return data.name;
    }

    return otherUser?.name || otherUser?.email;
  }, [data.isGroup, data.name, otherUser?.email, otherUser?.name]);

  const statusText = useMemo(() => {
    if (data.isGroup) {
      return `${data.users.length} members`;
    }

    return isActive ? "Active" : "Offline";
  }, [data, isActive]);

  return (
    <DialogProvider
      title="Details"
      trigger={
        <EllipsisIcon
          className="text-cyan-500 cursor-pointer hover:text-cyan-600 transition"
          size={32}
        />
      }
    >
      <div className="flex h-full flex-col overflow-y-scroll bg-white py-6">
        <div className="relative mt-6 flex-1 px-4 sm:px-6">
          <div className="flex flex-col items-center">
            <div className="mb-2">
              {data.isGroup ? (
                <AvatarGroup users={data.users} />
              ) : (
                <Avatar user={otherUser} />
              )}
            </div>
            <div>{title}</div>
            <div className="text-sm text-gray-500">{statusText}</div>
            <div className="flex gap-10 my-8">
              <ConfirmModal />
            </div>
            <div className="w-full pb-5 pt-5 sm:px-0 sm:pt-0">
              <dl className="space-y-8 px-4 sm:space-y-6 sm:px-6">
                {data.isGroup ? (
                  <div>
                    <dt className="text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0">
                      Members
                    </dt>
                    <dd className="mt-1 font-medium text-sm text-gray-900 sm:col-span-2">
                      {data.users
                        .map((user) => user.name || user.email)
                        .join(", ")}
                    </dd>
                  </div>
                ) : (
                  <div>
                    <dt className="text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0">
                      Email
                    </dt>
                    <dd className="mt-1 font-medium text-sm text-gray-900 sm:col-span-2">
                      {otherUser?.email}
                    </dd>
                  </div>
                )}
                {data.isGroup ? (
                  <>
                    <hr />
                    <div>
                      <dt className="text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0">
                        Created
                      </dt>
                      <dd className="mt-1 font-medium text-sm text-gray-900 sm:col-span-2">
                        <time dateTime={joinedDate}>
                          {joinedDate} ({formatDistanceToNowStrict(joinedDate)}{" "}
                          ago)
                        </time>
                      </dd>
                    </div>
                  </>
                ) : (
                  <>
                    <hr />
                    <div>
                      <dt className="text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0">
                        Joined
                      </dt>
                      <dd className="mt-1 font-medium text-sm text-gray-900 sm:col-span-2">
                        <time dateTime={joinedDate}>
                          {joinedDate} ({formatDistanceToNowStrict(joinedDate)}{" "}
                          ago)
                        </time>
                      </dd>
                    </div>
                  </>
                )}
              </dl>
            </div>
          </div>
        </div>
      </div>
    </DialogProvider>
  );
};
export default ProfileDrawer;
