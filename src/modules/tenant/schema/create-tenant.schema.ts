import { z } from 'zod';

export const CreateTenantSchema = z.object({
  name: z.string().nonempty(),
  address: z.string().nonempty(),
});
