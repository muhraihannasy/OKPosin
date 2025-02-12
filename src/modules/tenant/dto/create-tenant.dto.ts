import { z } from 'zod';
import { CreateTenantSchema } from '../schema/create-tenant.schema';

export type CreateTenantDTO = z.infer<typeof CreateTenantSchema>;
