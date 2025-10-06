export const UNIT_ALIASES = [
  'gram',
  'kilogram',
  'millilitre',
  'litre',
  'teaspoon',
  'tablespoon',
  'cup',
  'ounce',
  'pound',
  'piece',
] as const;

export const UNITS = ['g', 'kg', 'ml', 'L', 'tsp', 'tbsp', 'cup', 'oz', 'lb', 'piece'] as const;

export type Unit = (typeof UNITS)[number];
export type UnitAlias = (typeof UNIT_ALIASES)[number];

const UNIT_SET: ReadonlySet<Unit> = new Set(UNITS);

const UNIT_TO_ALIAS_MAP: Readonly<Record<Unit, UnitAlias>> = Object.freeze({
  g: 'gram',
  kg: 'kilogram',
  ml: 'millilitre',
  L: 'litre',
  tsp: 'teaspoon',
  tbsp: 'tablespoon',
  cup: 'cup',
  oz: 'ounce',
  lb: 'pound',
  piece: 'piece',
});

const ALIAS_TO_UNIT_MAP: Readonly<Record<UnitAlias, Unit>> = Object.freeze(
  Object.fromEntries(Object.entries(UNIT_TO_ALIAS_MAP).map(([u, a]) => [a, u as Unit])) as Record<UnitAlias, Unit>
);

export function getAvailableUnits(): readonly Unit[] {
  return UNITS;
}

export function getUnitMap(): Readonly<Record<Unit, UnitAlias>> {
  return UNIT_TO_ALIAS_MAP;
}

export function getUnitAlias(u: Unit | null | undefined): UnitAlias | undefined {
  return u ? UNIT_TO_ALIAS_MAP[u] : undefined;
}

export function isUnit(u: unknown): u is Unit {
  return typeof u === 'string' && UNIT_SET.has(u as Unit);
}

export function isUnitAlias(a: unknown): a is UnitAlias {
  return typeof a === 'string' && a in ALIAS_TO_UNIT_MAP;
}

export function normalizeUnit(u: unknown): Unit | undefined {
  if (typeof u !== 'string') {
    return undefined;
  }

  const v = u.trim();

  if (isUnit(v)) {
    return v as Unit;
  }

  if (isUnitAlias(v)) {
    return ALIAS_TO_UNIT_MAP[v];
  }

  return undefined;
}

export function formatUnitForDisplay(u: Unit | null | undefined): string {
  return u ?? '';
}
