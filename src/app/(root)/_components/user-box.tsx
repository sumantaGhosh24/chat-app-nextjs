"use client";

import {useCallback, useState} from "react";
import {useRouter} from "next/navigation";
import toast from "react-hot-toast";

import {User} from "@/generated/prisma";
import Avatar from "@/app/_components/avatar";
import {Card} from "@/components/ui/card";

interface UserBoxProps {
  user: User;
}

const UserBox: React.FC<UserBoxProps> = ({user}) => {
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const handleClick = useCallback(async () => {
    setIsLoading(true);

    try {
      fetch("/api/conversations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
        }),
      })
        .then((res) => res.json())
        .then((res) => router.push(`/conversations/${res.id}`));
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  }, [user, router]);

  return (
    <Card className="p-2 mb-2 last:mb-0">
      <div
        title="Start a chat"
        onClick={isLoading ? undefined : handleClick}
        className="w-full relative flex items-center space-x-3 rounded-lg transition cursor-pointer"
      >
        <Avatar user={user} />
        <div className="min-w-0 flex-1">
          <div className="focus:outline-none">
            <p className="text-sm font-medium">{user.name}</p>
            <p className="text-sm">{user.email}</p>
          </div>
        </div>
      </div>
    </Card>
  );
};
export default UserBox;
