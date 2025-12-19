import { z } from 'zod';

export const profileSchema = z.object({
  username: z
    .string()
    .min(3, 'Usernames must have at least 3 characters.')
    .max(30, 'Usernames cannot exceed 30 characters.')
    .regex(
      /^[a-zA-Z0-9_]+$/,
      'Usernames only contain letters, numbers, and underscores.'
    ),

  full_name: z
    .string()
    .min(3, 'Full name is too short')
    .max(50, 'Full name is too long'),
});

export type ProfileInput = z.infer<typeof profileSchema>;
