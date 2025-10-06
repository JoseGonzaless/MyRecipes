import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import {
  ingredientUpdateSchema,
  type IngredientUpdateFormValues,
  type IngredientUpdateInput,
} from '@/features/recipes/schemas/recipeIngredients';
import { getAvailableUnits, normalizeUnit, formatUnitForDisplay, getUnitMap } from '@/lib/units';
import type { Database } from '@/types/supabase.types';

type Ingredient = Database['public']['Tables']['recipe_ingredients']['Row'];

interface IngredientEditRowProps {
  ingredient: Ingredient;
  onSave: (id: string, patch: IngredientUpdateInput) => Promise<void>;
  onDelete: (id: string) => void;
}

const UNIT_ALIAS_MAP = getUnitMap();

export function IngredientEditRow({ ingredient, onSave, onDelete }: IngredientEditRowProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const normalizedUnit = normalizeUnit(ingredient.unit);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<IngredientUpdateFormValues>({
    resolver: zodResolver(ingredientUpdateSchema),
    defaultValues: {
      name: ingredient.name ?? '',
      quantity: ingredient.quantity ?? 1,
      unit: normalizedUnit,
      notes: ingredient.notes ?? undefined,
    },
  });

  useEffect(() => {
    if (!isEditing) {
      return;
    }

    reset({
      name: ingredient.name ?? '',
      quantity: ingredient.quantity ?? 1,
      unit: normalizeUnit(ingredient.unit),
      notes: ingredient.notes ?? undefined,
    });
  }, [isEditing, ingredient.id, ingredient.name, ingredient.quantity, ingredient.unit, ingredient.notes, reset]);

  async function onSubmit(values: IngredientUpdateFormValues) {
    setServerError(null);
    try {
      const parsed: IngredientUpdateInput = ingredientUpdateSchema.parse(values);
      await onSave(ingredient.id, parsed);
      setIsEditing(false);
    } catch (error) {
      console.error('Update failed:', error);
      setServerError('Failed to update ingredient.');
    }
  }

  if (!isEditing) {
    const displayUnit = formatUnitForDisplay(normalizedUnit);

    return (
      <section
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          gap: '1rem',
        }}>
        <div
          style={{
            flex: '1 1 16rem',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}>
          <strong>{ingredient.quantity}</strong>
          {displayUnit} {ingredient.name}
          {ingredient.notes && (
            <div style={{ fontStyle: 'italic', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              <small>{ingredient.notes}</small>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', gap: '1rem', flex: '0 1 8rem' }}>
          <button type="button" onClick={() => setIsEditing(true)}>
            Edit
          </button>

          <button type="button" onClick={() => onDelete(ingredient.id)}>
            Delete
          </button>
        </div>

        {serverError && <small role="alert">{serverError}</small>}
      </section>
    );
  }

  const isBusy = isSubmitting;

  return (
    <form onSubmit={handleSubmit(onSubmit)} aria-busy={isBusy}>
      <fieldset role="group" style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
        <label style={{ flex: '2 1 20rem' }}>
          Name
          <input
            type="text"
            {...register('name')}
            aria-invalid={!!errors.name || undefined}
            disabled={isBusy}
            style={{ marginBottom: '1rem' }}
          />
          {errors.name && <small role="alert">{errors.name.message}</small>}
        </label>

        <div style={{ display: 'flex', gap: '1rem', flex: '1 1 16rem' }}>
          <label style={{ flex: '1 1 8rem' }}>
            Quantity
            <input
              type="number"
              inputMode="numeric"
              min={1}
              {...register('quantity', { valueAsNumber: true })}
              aria-invalid={!!errors.quantity || undefined}
              disabled={isBusy}
              style={{ marginBottom: '1rem' }}
            />
            {errors.quantity && <small role="alert">{errors.quantity.message}</small>}
          </label>

          <label style={{ flex: '1 1 8rem' }}>
            Unit
            <select
              {...register('unit', {
                setValueAs: (v) => (v === '' ? undefined : v),
              })}
              aria-invalid={!!errors.unit || undefined}
              disabled={isBusy}
              style={{ marginBottom: '1rem' }}>
              <option value="">Choose</option>
              {getAvailableUnits().map((unit) => (
                <option key={unit} value={unit}>
                  {unit} {`(${UNIT_ALIAS_MAP[unit]})`}
                </option>
              ))}
            </select>
            {errors.unit && <small role="alert">{errors.unit.message}</small>}
          </label>
        </div>
      </fieldset>

      <label>
        Notes
        <textarea rows={3} {...register('notes')} aria-invalid={!!errors.notes || undefined} disabled={isBusy} />
        {errors.notes && <small role="alert">{errors.notes.message}</small>}
      </label>

      {serverError && <p role="alert">{serverError}</p>}

      <div style={{ display: 'flex', gap: '1rem' }}>
        <button type="submit" disabled={isBusy}>
          {isBusy ? 'Saving' : 'Save'}
        </button>
        <button
          type="button"
          disabled={isBusy}
          onClick={() => {
            reset({
              name: ingredient.name ?? '',
              quantity: ingredient.quantity ?? 1,
              unit: normalizeUnit(ingredient.unit),
              notes: ingredient.notes ?? undefined,
            });
            setIsEditing(false);
          }}>
          Cancel
        </button>
      </div>
    </form>
  );
}
