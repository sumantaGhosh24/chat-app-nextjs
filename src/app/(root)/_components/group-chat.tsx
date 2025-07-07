"use client";

import {useState, useEffect} from "react";
import {useRouter} from "next/navigation";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";
import toast from "react-hot-toast";

import {User} from "@/generated/prisma";
import {Button} from "@/components/ui/button";
import {GroupValidation} from "@/validations/group";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Checkbox} from "@/components/ui/checkbox";

const GroupChat = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    fetch("/api/users")
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((err) => toast.error(err.message));
  }, []);

  const form = useForm<z.infer<typeof GroupValidation>>({
    resolver: zodResolver(GroupValidation),
    defaultValues: {
      name: "",
      members: [],
    },
  });

  const onSubmit = (values: z.infer<typeof GroupValidation>) => {
    setLoading(true);

    try {
      fetch("/api/conversations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...values,
          isGroup: true,
        }),
      });

      form.reset();

      toast.success("Group chat created!");

      router.push("/conversations");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="name"
            render={({field}) => (
              <FormItem className="flex w-full flex-col gap-3">
                <FormLabel className="text-base font-semibold">
                  Group Name
                </FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    className="bg-gray-200 focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0"
                    placeholder="Enter group name"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="members"
            render={() => (
              <FormItem className="flex w-full flex-col gap-3 mb-4">
                <FormLabel className="text-base font-semibold">
                  Group Members
                </FormLabel>
                {users.length < 1 ? (
                  <span>Loading...</span>
                ) : (
                  users.map((user) => (
                    <FormField
                      key={user.id}
                      control={form.control}
                      name="members"
                      render={({field}) => {
                        return (
                          <FormItem
                            key={user.id}
                            className="flex flex-row items-center gap-2"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(user.id)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...field.value, user.id])
                                    : field.onChange(
                                        field.value?.filter(
                                          (value) => value !== user.id
                                        )
                                      );
                                }}
                              />
                            </FormControl>
                            <FormLabel className="text-sm font-normal">
                              <Avatar>
                                <AvatarImage src={user.imageUrl as string} />
                                <AvatarFallback>
                                  {user.name.substring(0, 2)}
                                </AvatarFallback>
                              </Avatar>
                              {user.name}
                            </FormLabel>
                          </FormItem>
                        );
                      }}
                    />
                  ))
                )}
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            disabled={loading}
            className="max-w-fit bg-blue-700 hover:bg-blue-800 disabled:bg-blue-300"
          >
            {loading ? "Processing..." : "Create Group"}
          </Button>
        </form>
      </Form>
    </>
  );
};

export default GroupChat;
