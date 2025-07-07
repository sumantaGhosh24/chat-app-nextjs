"use client";

import {useEffect, useState} from "react";
import toast from "react-hot-toast";

import {User} from "@/generated/prisma";
import {ScrollArea} from "@/components/ui/scroll-area";

import UserBox from "./user-box";

const UserList = () => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    fetch("/api/users")
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);
      })
      .catch((err) => {
        toast.error(err.message);
      });
  }, []);

  return (
    <ScrollArea className="max-h-[500px] w-full rounded-md border p-2">
      {users.map((user) => (
        <UserBox key={user.id} user={user} />
      ))}
    </ScrollArea>
  );
};
export default UserList;
