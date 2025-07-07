"use server";

import {revalidatePath} from "next/cache";

import {destroyFromCloudinary, uploadToCloudinary} from "@/lib/cloudinary";
import {db} from "@/lib/db";

interface UpdateUserParams {
  id: string;
  name: string;
  formData?: any;
  public_id?: string;
  path: string;
}

export async function updateUser({
  id,
  name,
  formData,
  public_id,
  path,
}: UpdateUserParams) {
  try {
    if (!formData) {
      await db.user.update({
        where: {id},
        data: {
          name: name.toLowerCase(),
        },
      });
    } else {
      const files = formData.getAll("files");

      const [res] = await uploadToCloudinary(files);

      await Promise.all([
        await db.user.update({
          where: {id},
          data: {
            name: name.toLowerCase(),
            imageUrl: res?.secure_url,
            imagePublicId: res?.public_id,
          },
        }),
        destroyFromCloudinary(public_id!),
      ]);
    }

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Failed to update user: ${error.message}`);
  }
}
