import {z} from "zod";

export const MessageValidation = z.object({
  message: z
    .string()
    .min(1, {message: "minimum 1 character long"})
    .max(200, {message: "maximum 200 characters long"})
    .trim(),
});
