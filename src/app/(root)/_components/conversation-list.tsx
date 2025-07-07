"use client";

import {useState, useMemo, useEffect} from "react";
import {useRouter} from "next/navigation";
import {useSession} from "next-auth/react";
import {find} from "lodash";
import toast from "react-hot-toast";

import {FullConversationType} from "@/types";
import useConversation from "@/hooks/useConversation";
import {pusherClient} from "@/lib/pusher";

import ConversationBox from "./conversation-box";

const ConversationList = () => {
  const [conversations, setConversations] = useState<FullConversationType[]>(
    []
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch("/api/conversations")
      .then((res) => res.json())
      .then((data) => {
        setConversations(data);
      })
      .catch((err) => toast.error(err.message))
      .finally(() => setLoading(false));
  }, []);

  const session = useSession();
  const router = useRouter();

  const {conversationId} = useConversation();

  const pusherKey = useMemo(() => {
    return session.data?.user?.email;
  }, [session.data?.user?.email]);

  useEffect(() => {
    if (!pusherKey) return;

    pusherClient.subscribe(pusherKey);

    const newHandler = (conversation: FullConversationType) => {
      setConversations((prevConversations) => {
        if (find(prevConversations, {id: conversation.id}))
          return prevConversations;
        return [conversation, ...prevConversations];
      });
    };

    const updateHandler = (conversation: FullConversationType) => {
      setConversations((prevConversations) =>
        prevConversations.map((c) => {
          if (c.id === conversation.id) {
            return {...c, messages: conversation.messages};
          }

          return c;
        })
      );
    };

    const deleteHandler = (conversation: FullConversationType) => {
      setConversations((prevConversations) =>
        prevConversations.filter((c) => c.id !== conversation.id)
      );

      if (conversationId === conversation.id) {
        router.push("/conversations");
      }
    };

    pusherClient.bind("conversation:new", newHandler);
    pusherClient.bind("conversation:update", updateHandler);
    pusherClient.bind("conversation:delete", deleteHandler);

    return () => {
      pusherClient.unsubscribe(pusherKey);
      pusherClient.unbind("conversation:new", newHandler);
      pusherClient.unbind("conversation:update", updateHandler);
      pusherClient.unbind("conversation:delete", deleteHandler);
    };
  }, [pusherKey, conversationId, router]);

  return (
    <>
      {loading ? (
        <span>Loading...</span>
      ) : (
        conversations.map((conversation) => (
          <ConversationBox
            key={conversation.id}
            conversation={conversation}
            selected={conversationId === conversation.id}
          />
        ))
      )}
    </>
  );
};
export default ConversationList;
