import { z } from 'zod';
import { createUserSchema } from '../schema/create-user.schema';

export type CreateUserDTO = z.infer<typeof createUserSchema>;
