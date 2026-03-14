"use client";

import Image from "next/image";
import {formatDistanceToNowStrict} from "date-fns";

import {User} from "@/generated/prisma";

interface UserDetailsProps {
  user: User;
}

const UserDetails = ({user}: UserDetailsProps) => {
  return (
    <div className="container mx-auto space-y-4 rounded-md p-5 shadow-md dark:shadow-gray-400">
      <div className="rounded-2xl shadow-xl overflow-hidden">
        <div className="h-40 bg-gradient-to-r from-blue-500 to-indigo-500" />
        <div className="flex justify-center -mt-16">
          <Image
            src={user.imageUrl as string}
            alt={user.imagePublicId || "user"}
            height={120}
            width={120}
            className="rounded-full border-4 border-white dark:border-gray-900 object-cover"
          />
        </div>
        <div className="text-center mt-4 px-6 pb-6">
          <h2 className="text-3xl font-bold capitalize">{user.name}</h2>
          <p className="text-gray-500 mt-1">{user.email}</p>
          <div className="border-t my-6" />
          <div className="grid md:grid-cols-2 gap-6 text-sm text-left">
            <div className="space-y-3 flex">
              <p>
                <span className="font-semibold">Mobile:</span>{" "}
                {user.mobileNumber}
              </p>
            </div>
            <div className="space-y-3 flex">
              <p>
                <span className="font-semibold">Created:</span>{" "}
                {new Date(user.createdAt).toLocaleDateString()}{" "}
              </p>
              (
              <p className="text-gray-500 text-xs">
                {formatDistanceToNowStrict(user.createdAt)} ago
              </p>
              )
            </div>
            <div className="space-y-3 flex">
              <p>
                <span className="font-semibold">Updated:</span>{" "}
                {new Date(user.updatedAt).toLocaleDateString()}{" "}
              </p>
              (
              <p className="text-gray-500 text-xs">
                {formatDistanceToNowStrict(user.updatedAt)} ago
              </p>
              )
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetails;
