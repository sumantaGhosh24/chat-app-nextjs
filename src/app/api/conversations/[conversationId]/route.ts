import {NextResponse} from "next/server";

import getServerUser from "@/actions/getServerUser";
import {db} from "@/lib/db";
import {pusherServer} from "@/lib/pusher";

type IParams = Promise<{
  conversationId?: string;
}>;

export async function DELETE(request: Request, {params}: {params: IParams}) {
  try {
    const currentUser = await getServerUser();
    const {conversationId} = await params;

    if (!currentUser?.id || !currentUser?.email) {
      return new NextResponse("Unauthorized", {status: 401});
    }

    const existingConversation = await db.conversation.findUnique({
      where: {
        id: conversationId,
      },
      include: {
        users: true,
      },
    });

    if (!existingConversation) {
      return new NextResponse("Invalid ID", {status: 400});
    }

    const deletedConversation = await db.conversation.deleteMany({
      where: {
        id: conversationId,
        userIds: {
          hasSome: [currentUser.id],
        },
      },
    });

    existingConversation.users.forEach((user) => {
      if (user.email) {
        pusherServer.trigger(
          user.email,
          "conversation:delete",
          existingConversation
        );
      }
    });

    return NextResponse.json(deletedConversation);
  } catch (error: any) {
    return new NextResponse("Internal Server Error", {status: 500});
  }
}
