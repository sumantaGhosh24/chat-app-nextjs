"use client";

import {useState} from "react";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";
import {CldUploadButton} from "next-cloudinary";
import toast from "react-hot-toast";
import {Image, Send} from "lucide-react";

import useConversation from "@/hooks/useConversation";
import {MessageValidation} from "@/validations/message";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";

const MessageForm = () => {
  const [loading, setLoading] = useState(false);

  const {conversationId} = useConversation();

  const form = useForm<z.infer<typeof MessageValidation>>({
    resolver: zodResolver(MessageValidation),
    defaultValues: {
      message: "",
    },
  });

  const onSubmit = (values: z.infer<typeof MessageValidation>) => {
    setLoading(true);

    fetch(`/api/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...values,
        conversationId,
      }),
    })
      .then(() => form.reset())
      .catch((err) => toast.error(err.message))
      .finally(() => setLoading(false));
  };

  const handleUpload = (result: any) => {
    fetch(`/api/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        image: result?.info?.secure_url,
        conversationId,
      }),
    });
  };

  return (
    <div className="py-4 px-4 bg-white border-t flex items-center gap-2 lg:gap-4 w-full">
      <CldUploadButton
        options={{maxFiles: 1}}
        onSuccess={handleUpload}
        uploadPreset="react_native"
      >
        <Image size={30} className="text-blue-700" />
      </CldUploadButton>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex items-center gap-1.5 w-full"
        >
          <FormField
            control={form.control}
            name="message"
            render={({field}) => (
              <FormItem className="w-full">
                <FormControl>
                  <Input
                    type="text"
                    className="bg-gray-200 focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0 w-full"
                    placeholder="Enter your message"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            disabled={loading}
            className="rounded-full p-2 cursor-pointer bg-blue-700 hover:bg-blue-800"
          >
            <Send size={20} className="text-white" />
          </Button>
        </form>
      </Form>
    </div>
  );
};
export default MessageForm;
