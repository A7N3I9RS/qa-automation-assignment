import { z } from 'zod';

export const CreateUserPayloadSchema = z.object({
  name: z.string(),
  job: z.string()
});

export const CreateUserResponseSchema = z.object({
  name: z.string(),
  job: z.string(),
  id: z.string().min(1),
  createdAt: z.string().min(1)
});

export type CreateUserPayload = z.infer<typeof CreateUserPayloadSchema>;
export type CreateUserResponse = z.infer<typeof CreateUserResponseSchema>;
