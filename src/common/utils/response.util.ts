import { object, ZodError } from 'zod';

export interface APIResponse<T> {
  success: boolean;
  data?: T;
  errors?: any[];
}

export function createResponse<T>(data?: T, errors: any = []): APIResponse<T> {
  const response = { success: true, data, errors };

  if (errors !== null) {
    response.success = false;

    delete response.data;
  }

  return response;
}
