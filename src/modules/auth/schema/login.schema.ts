import { z } from 'zod';

export const LoginSchema = z.object({
  email: z.string().nonempty().email(),
  password: z.string().nonempty(),
});
