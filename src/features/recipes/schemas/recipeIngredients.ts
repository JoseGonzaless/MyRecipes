import { z } from 'zod';
import { UnitRequiredField } from './units';

const preprocessNumber = (val: unknown) => {
  if (val === '' || val === null || val === undefined) return undefined;
  if (typeof val === 'number' && Number.isNaN(val)) return undefined;
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
    if (v === undefined) return undefined;
    if (v === null || v.length === 0) return null;
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

export const ingredientCreateSchema = z.object({
  name: z.string().trim().min(1, 'Required'),
  quantity: requiredPositiveInt,
  unit: UnitRequiredField,
  notes: optionalTextCreate,
});

export type IngredientCreateFormValues = z.input<typeof ingredientCreateSchema>;
export type IngredientCreateInput = z.output<typeof ingredientCreateSchema>;

export const ingredientUpdateSchema = z.object({
  name: z.string().trim().min(1, 'Required').optional(),
  quantity: requiredPositiveInt,
  unit: UnitRequiredField,
  notes: optionalTextUpdate,
});

export type IngredientUpdateFormValues = z.input<typeof ingredientUpdateSchema>;
export type IngredientUpdateInput = z.output<typeof ingredientUpdateSchema>;
