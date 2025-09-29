import { z } from 'zod';

export const signInSchema = z.object({
  email: z.email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});

export type SignInInput = z.infer<typeof signInSchema>;

export const signUpSchema = z
  .object({
    email: z.email('Enter a valid email'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[a-z]/, 'Must contain a lowercase letter')
      .regex(/[A-Z]/, 'Must contain an uppercase letter')
      .regex(/[^a-zA-Z0-9]/, 'Must contain a special character'),
    confirm: z.string(),
  })
  .refine((data) => data.password === data.confirm, {
    path: ['confirm'],
    message: 'Passwords do not match',
  });

export type SignUpInput = z.infer<typeof signUpSchema>;

export const resetSchema = z.object({
  email: z.email('Enter a valid email'),
});

export type ResetInput = z.infer<typeof resetSchema>;
