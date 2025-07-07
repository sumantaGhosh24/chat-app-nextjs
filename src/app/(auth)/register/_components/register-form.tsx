"use client";

import {useState} from "react";
import {useRouter} from "next/navigation";
import Image from "next/image";
import toast from "react-hot-toast";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";

import {registerUser} from "@/actions/registerUser";
import {validFiles} from "@/lib/utils";
import {UserRegistrationValidation} from "@/validations/user";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";

interface File {
  status: string;
  imgUrl: string;
  message?: string;
  fileUpload: undefined;
}

const RegisterForm = () => {
  const [file, setFile] = useState<File>();
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const form = useForm<z.infer<typeof UserRegistrationValidation>>({
    resolver: zodResolver(UserRegistrationValidation),
    defaultValues: {
      email: "",
      password: "",
      cf_password: "",
      name: "",
      mobileNumber: "",
    },
  });

  const onSubmit = async (
    values: z.infer<typeof UserRegistrationValidation>
  ) => {
    setLoading(true);
    try {
      if (!file) return toast.error("Please upload an image.");

      const formData = new FormData();
      if (file) {
        formData.append("files", file.fileUpload!);
        URL.revokeObjectURL(file.imgUrl);
      }

      await registerUser({
        email: values.email,
        password: values.password,
        name: values.name,
        mobileNumber: values.mobileNumber,
        formData,
      });
      toast.success("Register successful!");
      router.push("/login");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (files: any) => {
    if (!files.length) return;
    // eslint-disable-next-line array-callback-return
    [...files].map((file) => {
      const result = validFiles(file);
      if (result?.message) return toast("something went wrong");
      setFile(result as any);
    });
  };

  const handleDrop = (e: any) => {
    e.preventDefault();
    const data = e.dataTransfer;
    handleImageChange(data.files);
  };

  return (
    <>
      <Form {...form}>
        <form
          className="flex flex-col justify-start gap-10"
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <h1 className="mb-5 text-2xl font-bold">Register Form</h1>
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center rounded-full bg-black w-[50%]">
              <Image
                src={file?.imgUrl || "https://placehold.co/600x400.png"}
                alt="image"
                width={200}
                height={200}
                sizes="50vw"
                priority
                className="h-[250px] w-full rounded-md object-cover"
              />
            </div>
            <div className="flex-1 text-base font-semibold text-gray-200">
              <Input
                type="file"
                accept=".png, .jpg, .jpeg"
                placeholder="Add your image"
                className="cursor-pointer border-none bg-transparent outline-none file:text-primary"
                onChange={(e) => handleImageChange(e.target.files)}
              />
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-2">
            <FormField
              control={form.control}
              name="email"
              render={({field}) => (
                <FormItem className="flex w-full flex-col gap-3">
                  <FormLabel className="text-base font-semibold">
                    Email Address
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      className="bg-gray-200 focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0"
                      placeholder="Enter user email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="mobileNumber"
              render={({field}) => (
                <FormItem className="flex w-full flex-col gap-3">
                  <FormLabel className="text-base font-semibold">
                    Mobile Number
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      className="bg-gray-200 focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0"
                      placeholder="Enter user mobile number"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="name"
            render={({field}) => (
              <FormItem className="flex w-full flex-col gap-3">
                <FormLabel className="text-base font-semibold">Name</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    className="bg-gray-200 focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0"
                    placeholder="Enter user name"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex flex-col md:flex-row gap-2">
            <FormField
              control={form.control}
              name="password"
              render={({field}) => (
                <FormItem className="flex w-full flex-col gap-3">
                  <FormLabel className="text-base font-semibold">
                    Password
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      className="bg-gray-200 focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0"
                      placeholder="Enter user password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="cf_password"
              render={({field}) => (
                <FormItem className="flex w-full flex-col gap-3">
                  <FormLabel className="text-base font-semibold">
                    Confirm Password
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      className="bg-gray-200 focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0"
                      placeholder="Enter user confirm password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button
            type="submit"
            disabled={loading}
            className="max-w-fit bg-blue-700 hover:bg-blue-800 disabled:bg-blue-300"
          >
            {loading ? "Processing..." : "Register"}
          </Button>
        </form>
      </Form>
    </>
  );
};

export default RegisterForm;
