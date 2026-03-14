import Link from "next/link";

import {Button} from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6">
      <div className="max-w-xl w-full bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-10 text-center space-y-6">
        <div className="flex justify-center">
          <div className="w-16 h-16 flex items-center justify-center rounded-full bg-blue-100 text-blue-700 text-2xl font-bold">
            💬
          </div>
        </div>
        <h1 className="text-4xl font-bold tracking-tight">
          Welcome to <span className="text-blue-600">Chat App</span>
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Connect with friends, send messages instantly, and enjoy real-time
          conversations.
        </p>
        <div className="flex justify-center gap-4 pt-4">
          <Link href="/login">
            <Button className="px-6 py-5 text-lg">Login</Button>
          </Link>
          <Link href="/register">
            <Button variant="outline" className="px-6 py-5 text-lg">
              Register
            </Button>
          </Link>
        </div>
        <p className="text-sm text-gray-500 pt-4">
          Fast • Secure • Real-time messaging
        </p>
      </div>
    </div>
  );
}
