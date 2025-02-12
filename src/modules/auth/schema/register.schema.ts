import { z } from 'zod';

export const RegisterSchema = z.object({
  name: z.string().nonempty(),
  email: z.string().nonempty().email(),
  password: z.string().nonempty(),
  phone: z.string().nonempty(),
  tenant_name: z.string().nonempty(),
  tenant_address: z.string().nonempty(),
});
