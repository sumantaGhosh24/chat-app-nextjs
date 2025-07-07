"use client";

import {useRouter} from "next/navigation";

import {Button} from "@/components/ui/button";

const NotFound = () => {
  const router = useRouter();

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="w-[60%] h-[400px] rounded-md shadow-md dark:shadow-gray-400 flex flex-col items-center justify-center gap-5">
        <h1 className="text-4xl font-bold">404 | Page Not Found</h1>
        <h3 className="text-lg">Something Went Wrong!</h3>
        <Button onClick={() => router.push("/")}>Go Back Home</Button>
      </div>
    </div>
  );
};

export default NotFound;
