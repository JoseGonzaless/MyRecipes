import { z } from 'zod';

export const recipeCreateSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  serving_size: z.number().int().positive('Must be at least 1'),
});

export type RecipeCreateInput = z.infer<typeof recipeCreateSchema>;
