import { z } from 'zod';
import { UNITS } from '@/lib/constants';

const UnitEnum = z.enum(UNITS);

const optionalTextCreate = z
  .string()
  .trim()
  .optional()
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

export const ingredientCreateSchema = z.object({
  name: z.string().trim().min(1, 'Required'),
  quantity: z.number().min(1, 'Must be ≥ 1'),
  unit: UnitEnum,
  notes: optionalTextCreate,
});

export type IngredientCreateFormValues = z.input<typeof ingredientCreateSchema>;
export type IngredientCreateInput = z.output<typeof ingredientCreateSchema>;

export const ingredientUpdateSchema = z.object({
  name: z.string().trim().min(1).optional(),
  quantity: z.number().min(1).optional(),
  unit: UnitEnum,
  notes: optionalTextUpdate,
});

export type IngredientUpdateFormValues = z.input<typeof ingredientUpdateSchema>;
export type IngredientUpdateInput = z.output<typeof ingredientUpdateSchema>;
