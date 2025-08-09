"use server";

import bcrypt from "bcryptjs";
import {faker} from "@faker-js/faker";

import {db} from "@/lib/db";

export async function seedDB() {
  try {
    console.log("Database seeding started...");

    console.log("Seeding users...");
    const users = [];
    for (let i = 0; i < 10; i++) {
      const firstName = faker.person.firstName().toLowerCase();
      const lastName = faker.person.lastName().toLowerCase();
      const user = await db.user.create({
        data: {
          name: firstName + lastName,
          email: faker.internet.email({firstName, lastName}).toLowerCase(),
          mobileNumber: faker.phone.number({style: "international"}),
          imageUrl:
            "https://res.cloudinary.com/dzqgzsnoc/image/upload/v1753507657/accommodation-booking/tmp-1-1753507651178_azu5rk.jpg",
          imagePublicId: "accommodation-booking/tmp-1-1753507651178_azu5rk",
          password: await bcrypt.hash(firstName, 10),
        },
      });
      users.push(user);
    }
    console.log(`Seeded ${users.length} users.`);

    console.log("Database seeding complete!");
  } catch (error: any) {
    throw new Error(`Failed to seed database: ${error.message}`);
  }
}
