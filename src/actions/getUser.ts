"use server";

import {db} from "@/lib/db";

import getServerUser from "./getServerUser";

export async function getUser() {
  try {
    const user = await getServerUser();
    if (!user) throw new Error("Unauthorized");

    const userData = await db.user.findUnique({
      where: {id: user?.id},
      select: {
        id: true,
        name: true,
        email: true,
        mobileNumber: true,
        imageUrl: true,
        imagePublicId: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!userData) throw new Error("User does not exists.");

    return JSON.parse(JSON.stringify(userData));
  } catch (error: any) {
    throw new Error(`Failed to get user data: ${error.message}`);
  }
}
