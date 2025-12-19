import { z } from 'zod';

export const channelSchema = z.object({
  channelName: z
    .string()
    .min(3, 'Channel must have at least 3 characters.')
    .max(50, 'Channel cannot exceed 50 characters.')
    .regex(
      /^@[a-zA-Z0-9_]{3,20}$/,
      'Channel name must start with @ and be 3-20 characters long, containing only letters, numbers, and underscores.'
    ),
});

export type ChannelInput = z.infer<typeof channelSchema>;
