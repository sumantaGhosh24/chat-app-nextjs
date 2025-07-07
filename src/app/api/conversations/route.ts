import {NextResponse} from "next/server";

import getServerUser from "@/actions/getServerUser";
import {db} from "@/lib/db";
import {pusherServer} from "@/lib/pusher";

export async function GET() {
  try {
    const user = await getServerUser();

    if (!user) {
      return new NextResponse("Unauthorized", {status: 401});
    }

    const conversations = await db.conversation.findMany({
      orderBy: {lastMessageAt: "desc"},
      where: {userIds: {has: user.id}},
      include: {users: true, messages: {include: {seen: true, sender: true}}},
    });

    if (!conversations) {
      return new NextResponse("Conversations not found", {status: 400});
    }

    return NextResponse.json(conversations);
  } catch (error: any) {
    return new NextResponse("Internal Server Error", {status: 500});
  }
}

export async function POST(request: Request) {
  try {
    const currentUser = await getServerUser();

    const body = await request.json();

    const {userId, isGroup, members, name} = body;

    if (!currentUser?.id || !currentUser?.email) {
      return new NextResponse("Unauthorized", {status: 401});
    }

    if (isGroup && (!members || !name || members.length < 2)) {
      return new NextResponse("Group should at least have 3 members", {
        status: 400,
      });
    }

    if (isGroup) {
      const newConversation = await db.conversation.create({
        data: {
          name,
          isGroup,
          users: {
            connect: [
              {id: currentUser.id},
              ...members.map((member: string) => ({
                id: member,
              })),
            ],
          },
        },
        include: {
          users: true,
        },
      });

      newConversation.users.forEach((user) => {
        if (user.email) {
          pusherServer.trigger(user.email, "conversation:new", newConversation);
        }
      });

      return NextResponse.json(newConversation);
    }

    const existingConversations = await db.conversation.findMany({
      where: {
        OR: [
          {
            userIds: {
              equals: [currentUser.id, userId],
            },
          },
          {
            userIds: {
              equals: [userId, currentUser.id],
            },
          },
        ],
      },
    });

    const existingConversation = existingConversations[0];

    if (existingConversation) {
      return NextResponse.json(existingConversation);
    }

    const newConversation = await db.conversation.create({
      data: {
        users: {
          connect: [{id: currentUser.id}, {id: userId}],
        },
      },
      include: {
        users: true,
      },
    });

    newConversation.users.map((user) => {
      if (user.email) {
        pusherServer.trigger(user.email, "conversation:new", newConversation);
      }
    });

    return NextResponse.json(newConversation);
  } catch (error: any) {
    return new NextResponse("Internal Server Error", {status: 500});
  }
}
