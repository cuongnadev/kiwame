import { z } from "zod";

export const sendChatSchema = z.object({
  streamId: z.string().uuid(),
  message: z
    .string()
    .trim()
    .min(1, "Message cannot be empty")
    .max(500, "Message too long"),
});

export type SendChatInput = z.infer<typeof sendChatSchema>;
