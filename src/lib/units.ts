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

/* ---------- Types ---------- */

export type Unit = (typeof UNITS)[number];
export type UnitAlias = (typeof UNIT_ALIASES)[number];

/* ---------- Internal Maps/Sets (derived once) ---------- */

const UNIT_TO_ALIAS_MAP: Readonly<Record<Unit, UnitAlias>> = Object.freeze(
  UNITS.reduce((acc, u, i) => {
    acc[u] = UNIT_ALIASES[i];
    return acc;
  }, {} as Record<Unit, UnitAlias>)
);

const ALIAS_TO_UNIT_MAP: Readonly<Record<UnitAlias, Unit>> = Object.freeze(
  UNIT_ALIASES.reduce((acc, alias, i) => {
    acc[alias] = UNITS[i];
    return acc;
  }, {} as Record<UnitAlias, Unit>)
);

const UNIT_SET: ReadonlySet<Unit> = new Set(UNITS);
const UNIT_ALIAS_SET: ReadonlySet<UnitAlias> = new Set(UNIT_ALIASES);

/* ---------- Getters ---------- */

export function getAvailableUnits(): readonly Unit[] {
  return UNITS;
}

export function getAvailableUnitAliases(): readonly UnitAlias[] {
  return UNIT_ALIASES;
}

export function getUnitMap(): Readonly<Record<Unit, UnitAlias>> {
  return UNIT_TO_ALIAS_MAP;
}

export function getUnitAlias(u: Unit | null | undefined): UnitAlias | undefined {
  if (!u) return undefined;
  return UNIT_TO_ALIAS_MAP[u];
}

/* ---------- Guards & Normalizers ---------- */

export function isUnit(u: unknown): u is Unit {
  return typeof u === 'string' && UNIT_SET.has(u as Unit);
}

export function isUnitAlias(u: unknown): u is UnitAlias {
  return typeof u === 'string' && UNIT_ALIAS_SET.has(u as UnitAlias);
}

export function normalizeUnit(u: unknown): Unit | undefined {
  if (typeof u !== 'string') return undefined;
  const v = u.trim();
  if (isUnit(v)) return v as Unit;
  if (isUnitAlias(v as UnitAlias)) return ALIAS_TO_UNIT_MAP[v as UnitAlias];
  return undefined;
}

export function formatUnitForDisplay(u: Unit | null | undefined): string {
  if (!u) return '';
  return u;
}
