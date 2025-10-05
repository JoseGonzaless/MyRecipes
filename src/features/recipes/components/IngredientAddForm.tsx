import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { getAvailableUnits, getUnitMap } from '@/lib/units';
import { useCreateIngredient } from '@/features/recipes/hooks/useRecipeIngredients';
import {
  ingredientCreateSchema,
  type IngredientCreateFormValues,
  type IngredientCreateInput,
} from '@/features/recipes/schemas/recipeIngredients';

const UNIT_ALIAS_MAP = getUnitMap();

export function IngredientAddForm({ recipeId }: { recipeId: string }) {
  const create = useCreateIngredient(recipeId);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<IngredientCreateFormValues>({
    resolver: zodResolver(ingredientCreateSchema),
    defaultValues: { name: '', quantity: 1, unit: undefined, notes: undefined },
  });

  async function onSubmit(values: IngredientCreateFormValues) {
    setServerError(null);
    try {
      const parsed: IngredientCreateInput = ingredientCreateSchema.parse(values);
      await create.mutateAsync(parsed);
      reset({ name: '', quantity: 1, unit: 'Choose', notes: null });
    } catch (e: any) {
      setServerError(e?.message ?? 'Failed to add ingredient.');
    }
  }

  const busy = isSubmitting || create.isPending;

  return (
    <form onSubmit={handleSubmit(onSubmit)} aria-busy={busy}>
      <fieldset role="group" style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
        <label style={{ flex: '2 1 24rem' }}>
          Name
          <input
            type="text"
            autoComplete="off"
            {...register('name')}
            aria-invalid={!!errors.name || undefined}
            style={{ marginBottom: '1rem' }}
            disabled={busy}
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
              style={{ marginBottom: '1rem' }}
              disabled={busy}
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
              style={{ marginBottom: '1rem' }}
              disabled={busy}>
              <option> Choose </option>
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
        <textarea rows={3} {...register('notes')} aria-invalid={!!errors.notes || undefined} disabled={busy} />
        {errors.notes && <small role="alert">{errors.notes.message}</small>}
      </label>

      {serverError && <p role="alert">{serverError}</p>}

      <button type="submit" disabled={busy}>
        {busy ? 'Adding' : 'Add'}
      </button>
    </form>
  );
}
