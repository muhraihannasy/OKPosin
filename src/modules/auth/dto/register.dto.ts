import { z } from 'zod';
import { RegisterSchema } from '../schema/register.schema';

export type RegisterDTO = z.infer<typeof RegisterSchema>;
