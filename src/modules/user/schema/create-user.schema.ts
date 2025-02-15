import { z } from 'zod';

export const createUserSchema = z.object({
  email: z.string().email().nonempty(),
  password: z.string().min(6),
  phone: z.string().nonempty(),
  name: z.string().nonempty(),
  tenant_id: z.number().nonnegative(),
});
