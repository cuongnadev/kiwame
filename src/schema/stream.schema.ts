import { z } from "zod";

export const streamSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(120, "Title must be at most 120 characters"),

  description: z
    .string()
    .max(5000, "Description is too long")
    .optional()
    .or(z.literal("")),
});

export type StreamInput = z.infer<typeof streamSchema>;
