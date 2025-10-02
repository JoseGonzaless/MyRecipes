import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { useCreateIngredient } from '@/features/recipes/hooks/useRecipeIngredients';
import {
  ingredientCreateSchema,
  type IngredientCreateFormValues,
  type IngredientCreateInput,
} from '@/features/recipes/schemas/recipeIngredients';

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
      reset({ name: '', quantity: 1, unit: '', notes: '' });
    } catch (e: any) {
      setServerError(e?.message ?? 'Failed to add ingredient.');
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div role="group" style={{ gap: '2rem' }}>
        <label>
          Name
          <input type="text" autoComplete="off" {...register('name')} style={{ marginBottom: '1rem' }} />
          {errors.name && <small role="alert">{errors.name.message}</small>}
        </label>

        <label>
          Quantity
          <input
            type="number"
            inputMode="numeric"
            min={1}
            {...register('quantity', { valueAsNumber: true })}
            style={{ marginBottom: '1rem' }}
          />
          {errors.quantity && <small role="alert">{errors.quantity.message}</small>}
        </label>

        <label>
          Unit
          <input type="text" {...register('unit')} style={{ marginBottom: '1rem' }} />
        </label>
      </div>

      <label>
        Notes
        <textarea rows={5} {...register('notes')} />
      </label>

      {serverError && <p role="alert">{serverError}</p>}

      <button type="submit" disabled={isSubmitting || create.isPending}>
        {create.isPending ? 'Adding' : 'Add'}
      </button>
    </form>
  );
}
