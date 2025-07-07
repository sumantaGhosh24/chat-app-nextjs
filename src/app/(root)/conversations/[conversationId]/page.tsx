import getConversationById from "@/actions/getConversationById";
import getMessages from "@/actions/getMessages";
import {ScrollArea} from "@/components/ui/scroll-area";

import Body from "./_components/body";
import MessageForm from "./_components/message-form";
import Header from "./_components/header";

interface ConversationParams {
  params: Promise<{conversationId: string}>;
}

const Conversation = async ({params}: ConversationParams) => {
  const {conversationId} = await params;

  const conversation = await getConversationById(conversationId);
  const messages = await getMessages(conversationId);

  if (!conversation) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="w-[60%] h-[400px] rounded-md shadow-md dark:shadow-gray-400 flex flex-col items-center justify-center gap-5">
          <h1 className="text-4xl font-bold">No Conversation Found</h1>
          <h3 className="text-lg">Start a new conversation</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <Header conversation={conversation} />
      <ScrollArea className="h-[85vh] overflow-y-auto">
        <Body initialMessages={messages} />
      </ScrollArea>
      <MessageForm />
    </div>
  );
};

export default Conversation;
