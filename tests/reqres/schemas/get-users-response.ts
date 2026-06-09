import { z } from 'zod';

const UserSchema = z.object({
  id: z.number(),
  email: z.string(),
  first_name: z.string(),
  last_name: z.string(),
  avatar: z.string()
});

export const GetUsersResponseSchema = z.object({
  page: z.number(),
  per_page: z.number(),
  total: z.number(),
  total_pages: z.number(),
  data: z.array(UserSchema),
  support: z.object({
    url: z.string(),
    text: z.string()
  })
});

export type GetUsersResponse = z.infer<typeof GetUsersResponseSchema>;
