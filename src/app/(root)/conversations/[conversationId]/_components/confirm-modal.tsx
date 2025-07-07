"use client";

import {useState, useCallback} from "react";
import {useRouter} from "next/navigation";
import toast from "react-hot-toast";
import {Trash} from "lucide-react";

import useConversation from "@/hooks/useConversation";
import {Button} from "@/components/ui/button";
import DialogProvider from "@/app/(root)/_components/dialog-provider";

const ConfirmModal = () => {
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const {conversationId} = useConversation();

  const onDelete = useCallback(() => {
    setLoading(true);

    try {
      fetch(`/api/conversations/${conversationId}`, {
        method: "DELETE",
      });

      toast.success("Chat deleted!");

      router.push("/conversations");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <DialogProvider
      trigger={
        <Button className="bg-rose-700 hover:bg-rose-800">
          <Trash size={24} className="mr-2" /> Delete
        </Button>
      }
      title="Delete Conversations"
      description="Are your sure your want to delete this chat?"
    >
      <Button
        onClick={onDelete}
        disabled={loading}
        className="bg-rose-700 hover:bg-rose-800 disabled:bg-rose-300"
      >
        <Trash size={24} className="mr-2" />
        {loading ? "Deleting..." : "Delete"}
      </Button>
    </DialogProvider>
  );
};

export default ConfirmModal;
