import {NextResponse} from "next/server";

import getServerUser from "@/actions/getServerUser";
import {db} from "@/lib/db";

export async function GET() {
  try {
    const user = await getServerUser();

    if (!user) {
      return new NextResponse("Unauthorized", {status: 401});
    }

    const users = await db.user.findMany({
      orderBy: {createdAt: "desc"},
      where: {NOT: {email: user.email as string}},
    });

    if (!users) {
      return new NextResponse("Users not found", {status: 400});
    }

    return NextResponse.json(users);
  } catch (error: any) {
    return new NextResponse("Internal Server Error", {status: 500});
  }
}
