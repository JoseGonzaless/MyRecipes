import { z } from 'zod';
import { getAvailableUnits, isUnit, normalizeUnit, type Unit } from '@/lib/units';

type BuildUnitSchemaOptions = {
  required?: boolean;
  customUnits?: readonly string[];
  requiredMessage?: string;
  invalidMessage?: string;
};

const DEFAULT_REQUIRED = 'Unit is required';
const DEFAULT_INVALID = 'Select a valid unit';

// Preprocess: empty string -> undefined, alias -> canonical abbreviation.
const preprocessIncoming = (v: unknown) => {
  if (v === '') return undefined;
  if (typeof v === 'string') {
    const normalized = normalizeUnit(v);
    return normalized ?? v;
  }
  return v;
};

export function buildUnitSchema(opts: BuildUnitSchemaOptions = {}) {
  const { required = true, customUnits, requiredMessage = DEFAULT_REQUIRED, invalidMessage = DEFAULT_INVALID } = opts;

  const units = (customUnits ?? getAvailableUnits()) as readonly Unit[];

  const base = z.preprocess(preprocessIncoming, z.union([z.string(), z.undefined()])).superRefine((val, ctx) => {
    if (val === undefined) {
      if (required) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: requiredMessage,
        });
      }
      return;
    }

    if (!isUnit(val) || !units.includes(val as Unit)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: invalidMessage,
      });
    }
  });

  if (required) {
    return base.transform((v) => v as Unit);
  }

  return base.transform((v) => (v === undefined ? undefined : (v as Unit)));
}

export const UnitRequiredField = buildUnitSchema({ required: true });
export const UnitOptionalField = buildUnitSchema({ required: false });
