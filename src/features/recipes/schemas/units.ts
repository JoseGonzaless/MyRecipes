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

const preprocessIncoming = (v: unknown) => {
  if (v == null) {
    return undefined;
  }

  if (typeof v === 'string') {
    const trimmed = v.trim();

    if (trimmed === '') {
      return undefined;
    }

    const normalized = normalizeUnit(trimmed);

    return normalized ?? trimmed;
  }
  return v;
};

export function buildUnitSchema(opts: BuildUnitSchemaOptions = {}) {
  const { required = true, customUnits, requiredMessage = DEFAULT_REQUIRED, invalidMessage = DEFAULT_INVALID } = opts;

  const unitsList: readonly Unit[] = (customUnits ?? getAvailableUnits()) as readonly Unit[];
  const unitsSet = new Set(unitsList);

  const base = z.preprocess(preprocessIncoming, z.union([z.string(), z.undefined()])).superRefine((val, ctx) => {
    if (val === undefined) {
      if (required) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: requiredMessage });
      }
      return;
    }

    if (!isUnit(val) || !unitsSet.has(val)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: invalidMessage });
    }
  });

  return required
    ? base.transform((v) => v as Unit)
    : base.transform((v) => (v === undefined ? undefined : (v as Unit)));
}

export const UnitRequiredField = buildUnitSchema({ required: true });
export const UnitOptionalField = buildUnitSchema({ required: false });
