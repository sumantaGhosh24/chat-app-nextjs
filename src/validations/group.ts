import {z} from "zod";

export const GroupValidation = z.object({
  name: z
    .string()
    .min(3, {message: "minimum 3 character long"})
    .max(20, {message: "maximum 20 characters long"})
    .trim()
    .toLowerCase(),
  members: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "Select some users to continue",
  }),
});
