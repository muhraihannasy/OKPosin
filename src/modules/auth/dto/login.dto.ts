import { z } from 'zod';
import { LoginSchema } from '../schema/login.schema';

export type LoginDTO = z.infer<typeof LoginSchema>;
