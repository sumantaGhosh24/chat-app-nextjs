import Link from "next/link";

import RegisterForm from "./_components/register-form";

export default function RegisterPage() {
  return (
    <div className="my-20 flex min-h-[80vh] w-full items-center justify-center">
      <div className="min-w-[80%] space-y-4 rounded-md p-5 shadow-md dark:shadow-gray-400">
        <RegisterForm />
        <p className="text-sm">
          Already have an account?{" "}
          <Link
            href={"/login"}
            className="text-sm text-blue-800 hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
