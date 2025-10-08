import { z } from 'zod';

export const createUserSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters long')
    .max(100, 'Name must not exceed 100 characters'),
  email: z.string()
    .email('Please provide a valid email address'),
  age: z.number()
    .int('Age must be an integer')
    .min(1, 'Age must be at least 1')
    .max(150, 'Age must not exceed 150')
});

export const updateUserSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters long')
    .max(100, 'Name must not exceed 100 characters')
    .optional(),
  email: z.string()
    .email('Please provide a valid email address')
    .optional(),
  age: z.number()
    .int('Age must be an integer')
    .min(1, 'Age must be at least 1')
    .max(150, 'Age must not exceed 150')
    .optional()
}).refine(
  (data) => Object.keys(data).length > 0,
  {
    message: 'At least one field must be provided for update',
    path: ['root']
  }
);

export const userFiltersSchema = z.object({
  name: z.string().optional(),
  email: z.string().optional(),
  minAge: z.string()
    .transform((val) => parseInt(val, 10))
    .pipe(z.number()
      .int('Min age must be an integer')
      .min(1, 'Min age must be at least 1'))
    .optional(),
  maxAge: z.string()
    .transform((val) => parseInt(val, 10))
    .pipe(z.number()
      .int('Max age must be an integer')
      .max(150, 'Max age must not exceed 150'))
    .optional(),
  limit: z.string()
    .transform((val) => parseInt(val, 10))
    .pipe(z.number()
      .int('Limit must be an integer')
      .min(1, 'Limit must be at least 1')
      .max(100, 'Limit must not exceed 100'))
    .default(50)
    .optional(),
  offset: z.string()
    .transform((val) => parseInt(val, 10))
    .pipe(z.number()
      .int('Offset must be an integer')
      .min(0, 'Offset must be at least 0'))
    .default(0)
    .optional()
});

export const validateRequest = <T>(schema: z.ZodSchema<T>, data: any) => {
  try {
    const value = schema.parse(data);
    return { error: null, value };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { 
        error: error.issues.map((err: z.ZodIssue) => ({
          message: err.message,
          path: err.path.join('.')
        })), 
        value: null 
      };
    }
    return { error: [{ message: 'Validation error', path: 'root' }], value: null };
  }
};
