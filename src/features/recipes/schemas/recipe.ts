import { z } from 'zod';

export const recipeCreateSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  serving_size: z.number().int().positive('Must be at least 1'),
});
export type RecipeCreateInput = z.infer<typeof recipeCreateSchema>;

export const recipeUpdateSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  serving_size: z.number().int().min(1, 'Must be at least 1'),
});
export type RecipeUpdateInput = z.infer<typeof recipeUpdateSchema>;
