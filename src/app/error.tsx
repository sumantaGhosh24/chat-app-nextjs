"use client";

import {useRouter} from "next/navigation";

import {Button} from "@/components/ui/button";

interface ErrorProps {
  error: any;
  reset: () => void;
}

const ErrorState = ({error, reset}: ErrorProps) => {
  const router = useRouter();

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="w-[60%] h-[400px] rounded-md shadow-md dark:shadow-gray-400 flex flex-col items-center justify-center gap-5">
        <h1 className="text-4xl font-bold">Something Went Wrong!</h1>
        <h3 className="text-lg">{error.message}</h3>
        <div className="flex gap-3">
          <Button onClick={() => reset()}>Refresh</Button>
          <Button onClick={() => router.push("/")}>Go Back Home</Button>
        </div>
      </div>
    </div>
  );
};

export default ErrorState;
