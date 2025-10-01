import { z } from 'zod';

const optionalTextCreate = z
  .string()
  .trim()
  .optional()
  .transform((v) => (v && v.length ? v : undefined));

const optionalTextUpdate = z
  .string()
  .trim()
  .optional()
  .transform((v) => (v === undefined ? undefined : v.length ? v : null));

export const ingredientCreateSchema = z.object({
  name: z.string().trim().min(1, 'Required'),
  quantity: z.number().min(1, 'Must be ≥ 1'),
  unit: optionalTextCreate,
  notes: optionalTextCreate,
});

export type IngredientCreateFormValues = z.input<typeof ingredientCreateSchema>;
export type IngredientCreateInput = z.output<typeof ingredientCreateSchema>;

export const ingredientUpdateSchema = z.object({
  name: z.string().trim().min(1).optional(),
  quantity: z.number().min(1).optional(),
  unit: optionalTextUpdate,
  notes: optionalTextUpdate,
});

export type IngredientUpdateFormValues = z.input<typeof ingredientUpdateSchema>;
export type IngredientUpdateInput = z.output<typeof ingredientUpdateSchema>;
