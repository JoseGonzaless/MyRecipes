export const UNITS = [
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

export type Unit = (typeof UNITS)[number];

export function isUnit(u: unknown): u is Unit {
  return typeof u === 'string' && (UNITS as readonly string[]).includes(u);
}
