"use server";

import bcrypt from "bcryptjs";

import {uploadToCloudinary} from "@/lib/cloudinary";
import {db} from "@/lib/db";

interface RegisterUserParams {
  name: string;
  email: string;
  mobileNumber: string;
  password: string;
  formData: any;
}

export async function registerUser({
  name,
  email,
  mobileNumber,
  password,
  formData,
}: RegisterUserParams) {
  try {
    const files = formData.getAll("files");

    if (!name || !email || !mobileNumber || !password || !files) {
      throw new Error("Please fill the fields.");
    }

    const userEmail = await db.user.findUnique({where: {email}});
    if (userEmail)
      throw new Error("This email already registered, try another one.");

    const userMobileNumber = await db.user.findUnique({where: {mobileNumber}});
    if (userMobileNumber)
      throw new Error(
        "This mobile number already registered, try another one."
      );

    const hashedPassword = await bcrypt.hash(password, 10);

    const [res] = await uploadToCloudinary(files);

    await db.user.create({
      data: {
        name,
        email,
        mobileNumber,
        password: hashedPassword,
        imageUrl: res?.secure_url,
        imagePublicId: res?.public_id,
      },
    });
  } catch (error: any) {
    throw new Error(`Failed to register user: ${error.message}`);
  }
}
