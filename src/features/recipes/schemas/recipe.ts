import { z } from 'zod';

const preprocessNumber = (val: unknown) => {
  if (val === '' || val === null || val === undefined) {
    return undefined;
  }
  if (typeof val === 'number' && Number.isNaN(val)) {
    return undefined;
  }
  return val;
};

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
    if (v === undefined) {
      return undefined;
    }
    if (v === null || v.length === 0) {
      return null;
    }
    return v;
  });

const requiredPositiveInt = z.preprocess(
  preprocessNumber,
  z
    .union([
      z
        .number()
        .refine((v) => Number.isFinite(v), { message: 'Serving size must be a number' })
        .refine((v) => Number.isInteger(v), { message: 'Serving size must be a whole number' })
        .refine((v) => v >= 1, { message: 'Must be > 0' }),
      z.undefined(),
    ])
    .refine((v) => v !== undefined, { message: 'Required' })
    .transform((v) => v as number)
);

export const recipeCreateSchema = z.object({
  name: z.string().min(1, 'Required'),
  serving_size: requiredPositiveInt,
  total_time: requiredPositiveInt,
  notes: optionalTextCreate,
  image_url: optionalTextCreate,
  instructions: z.string().optional().nullable(),
});

export type RecipeCreateFormValues = z.input<typeof recipeCreateSchema>;
export type RecipeCreateInput = z.output<typeof recipeCreateSchema>;

export const recipeUpdateSchema = z.object({
  name: z.string().min(1, 'Required').optional(),
  serving_size: requiredPositiveInt,
  total_time: requiredPositiveInt,
  notes: optionalTextUpdate,
  image_url: optionalTextUpdate,
  instructions: z.string().optional().nullable(),
});

export type RecipeUpdateFormValues = z.input<typeof recipeUpdateSchema>;
export type RecipeUpdateInput = z.output<typeof recipeUpdateSchema>;
