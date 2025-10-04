import { z } from 'zod';

const optionalTextCreate = z
  .string()
  .trim()
  .nullish()
  .transform((v) => (v && v.length ? v : undefined));

const optionalTextUpdate = z
  .string()
  .trim()
  .nullish()
  .transform((v) => {
    if (v === undefined) return undefined;
    if (v === null || v.length === 0) return null;
    return v;
  });

const optionalIntCreate = z
  .number()
  .int()
  .min(1, 'Must be ≥ 1')
  .nullish()
  .transform((v) => (Number.isNaN(v) ? undefined : v));

const optionalIntUpdate = z
  .number()
  .int()
  .min(1, 'Must be ≥ 1')
  .nullish()
  .transform((v) => (v === undefined || Number.isNaN(v) ? undefined : v));

export const recipeCreateSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  serving_size: z.number().int().positive('Must be at least 1'),
  total_time: optionalIntCreate,
  notes: optionalTextCreate,
  image_url: optionalTextCreate,
  instructions: z.string().optional().nullable(),
});

export type RecipeCreateFormValues = z.input<typeof recipeCreateSchema>;
export type RecipeCreateInput = z.output<typeof recipeCreateSchema>;

export const recipeUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  serving_size: z.number().int().min(1, 'Must be at least 1').optional(),
  total_time: optionalIntUpdate,
  notes: optionalTextUpdate,
  image_url: optionalTextUpdate,
  instructions: z.string().optional().nullable(),
});

export type RecipeUpdateFormValues = z.input<typeof recipeUpdateSchema>;
export type RecipeUpdateInput = z.output<typeof recipeUpdateSchema>;
