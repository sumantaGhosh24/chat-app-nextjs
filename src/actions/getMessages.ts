"use server";

import {db} from "@/lib/db";

const getMessages = async (conversationId: string) => {
  try {
    const messages = await db.message.findMany({
      where: {
        conversationId,
      },
      include: {
        sender: true,
        seen: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return messages;
  } catch (error: any) {
    throw new Error(`Failed to get messages: ${error.message}`);
  }
};

export default getMessages;
