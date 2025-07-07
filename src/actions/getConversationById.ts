"use server";

import {db} from "@/lib/db";

import getServerUser from "./getServerUser";

const getConversationById = async (conversationId: string) => {
  try {
    const currentUser = await getServerUser();

    if (!currentUser) return null;

    const conversation = await db.conversation.findUnique({
      where: {
        id: conversationId,
      },
      include: {
        users: true,
      },
    });

    return conversation;
  } catch (error: any) {
    throw new Error(`Failed to get conversation: ${error.message}`);
  }
};

export default getConversationById;
