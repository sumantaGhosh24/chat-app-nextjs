"use client";

import Image from "next/image";
import {formatDistanceToNowStrict} from "date-fns";

import {User} from "@/generated/prisma";

interface UserDetailsProps {
  user: User;
}

const UserDetails = ({user}: UserDetailsProps) => {
  return (
    <div className="my-10 flex w-full items-center justify-center">
      <div className="w-[95%] space-y-4 rounded-lg p-5 shadow-lg shadow-black dark:shadow-white">
        <h1 className="mb-5 text-3xl font-bold">Your Details</h1>
        <div className="mb-5">
          <h2 className="text-2xl font-bold capitalize">{user.name}</h2>
        </div>
        <Image
          src={user.imageUrl as string}
          alt={user.imagePublicId || "user"}
          height={200}
          width={400}
          className="h-[250px] w-full rounded"
        />
        <h4 className="font-bold">Email: {user.email}</h4>
        <h4 className="font-bold">Mobile number: {user.mobileNumber}</h4>
        <h4 className="font-bold">
          Created at: {new Date(user.createdAt).toLocaleDateString()} (
          {formatDistanceToNowStrict(user.createdAt)} ago)
        </h4>
        <h4 className="font-bold">
          Updated at: {new Date(user.updatedAt).toLocaleDateString()} (
          {formatDistanceToNowStrict(user.updatedAt)} ago)
        </h4>
      </div>
    </div>
  );
};

export default UserDetails;
