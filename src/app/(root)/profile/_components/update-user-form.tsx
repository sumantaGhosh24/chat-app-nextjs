"use client";

import {useState} from "react";
import {usePathname} from "next/navigation";
import Image from "next/image";
import toast from "react-hot-toast";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";

import {updateUser} from "@/actions/updateUser";
import {validFiles} from "@/lib/utils";
import {UserUpdateValidation} from "@/validations/user";
import {User} from "@/generated/prisma";
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

interface UpdateUserFormProps {
  user: User;
}

const UpdateUserForm = ({user}: UpdateUserFormProps) => {
  const [file, setFile] = useState<File | null>();
  const [loading, setLoading] = useState(false);

  const path = usePathname();

  const form = useForm<z.infer<typeof UserUpdateValidation>>({
    resolver: zodResolver(UserUpdateValidation),
    defaultValues: {
      name: user.name,
    },
  });

  const onSubmit = async (values: z.infer<typeof UserUpdateValidation>) => {
    setLoading(true);
    try {
      const formData = new FormData();
      if (file) {
        formData.append("files", file.fileUpload!);
        URL.revokeObjectURL(file.imgUrl);
      }

      if (file) {
        await updateUser({
          id: user.id,
          name: values.name,
          formData,
          public_id: user.imagePublicId as string,
          path,
        });
      } else {
        await updateUser({
          id: user.id,
          name: values.name,
          path,
        });
      }

      toast.success("User updated successful!");
      setFile(null);
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
    <div className="container mx-auto space-y-4 rounded-md p-5 shadow-md dark:shadow-gray-400">
      <Form {...form}>
        <form
          className="flex flex-col justify-start gap-4"
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <h1 className="mb-5 text-3xl font-bold">Update User</h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center rounded-full bg-black w-[50%]">
              <Image
                src={
                  file?.imgUrl
                    ? file?.imgUrl
                    : user?.imageUrl
                    ? user?.imageUrl
                    : "https://placehold.co/600x400.png"
                }
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
                className="cursor-pointer border-none bg-transparent outline-none file:text-blue-800"
                onChange={(e) => handleImageChange(e.target.files)}
              />
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-2">
            <FormField
              control={form.control}
              name="name"
              render={({field}) => (
                <FormItem className="flex w-full flex-col gap-3">
                  <FormLabel className="text-base font-semibold">
                    Name
                  </FormLabel>
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
          </div>
          <Button
            type="submit"
            disabled={loading}
            className="max-w-fit bg-blue-700 hover:bg-blue-800 disabled:bg-blue-300"
          >
            {loading ? "Processing..." : "Update User"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default UpdateUserForm;
