import Link from "next/link";

import {Button} from "@/components/ui/button";

export default function Home() {
  return (
    <div className="h-[80vh] w-full flex items-center justify-center">
      <div className="h-[500px] w-[80%] rounded-md shadow-md dark:shadow-gray-400 flex flex-col items-center justify-center gap-5">
        <h1 className="text-4xl font-bold">Welcome to Chat App</h1>
        <h3 className="text-lg">Please login or register to continue</h3>
        <div className="flex gap-3">
          <Link href="/login" className="text-blue-700 hover:underline">
            <Button>Login</Button>
          </Link>
          <Link href="/register" className="text-blue-700 hover:underline">
            <Button>Register</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
