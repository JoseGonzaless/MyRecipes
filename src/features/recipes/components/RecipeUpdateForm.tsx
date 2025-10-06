import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { useUpdateRecipe } from '@/features/recipes/hooks/useRecipes';
import { recipeUpdateSchema, type RecipeUpdateFormValues } from '@/features/recipes/schemas/recipe';
import type { Database } from '@/types/supabase.types';

type Recipe = Database['public']['Tables']['recipes']['Row'];

export function RecipeUpdateForm({ recipe }: { recipe: Recipe }) {
  const update = useUpdateRecipe(recipe.id);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RecipeUpdateFormValues>({
    resolver: zodResolver(recipeUpdateSchema),
    defaultValues: {
      name: recipe.name ?? '',
      serving_size: recipe.serving_size ?? 1,
      total_time: recipe.total_time === null || recipe.total_time === undefined ? undefined : Number(recipe.total_time),
      notes: recipe.notes ?? undefined,
      instructions: Array.isArray(recipe.instructions)
        ? recipe.instructions.join('\n')
        : recipe.instructions ?? undefined,
    },
  });

  async function onSubmit(values: RecipeUpdateFormValues) {
    try {
      const parsed = recipeUpdateSchema.parse(values);
      await update.mutateAsync(parsed);
    } catch (error) {
      console.error('Failed to update recipe:', error);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <fieldset role="group" style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
        <label style={{ flex: '2 1 24rem' }}>
          Name
          <input
            type="text"
            autoComplete="off"
            {...register('name')}
            aria-invalid={!!errors.name || undefined}
            style={{ marginBottom: '1rem' }}
          />
          {errors.name && <small role="alert">{errors.name.message}</small>}
        </label>

        <div style={{ display: 'flex', gap: '1rem', flex: '1 1 16rem' }}>
          <label style={{ flex: '1 1 8rem' }}>
            Servings
            <input
              type="number"
              inputMode="numeric"
              min={1}
              {...register('serving_size', { valueAsNumber: true })}
              aria-invalid={!!errors.serving_size || undefined}
              style={{ marginBottom: '1rem' }}
            />
            {errors.serving_size && <small role="alert">{errors.serving_size.message}</small>}
          </label>

          <label style={{ flex: '1 1 8rem' }}>
            Total time (min)
            <input
              type="number"
              inputMode="numeric"
              min={0}
              {...register('total_time', { valueAsNumber: true })}
              aria-invalid={!!errors.total_time || undefined}
              style={{ marginBottom: '1rem' }}
            />
            {errors.total_time && <small role="alert">{errors.total_time.message}</small>}
          </label>
        </div>
      </fieldset>

      <label>
        Notes
        <textarea rows={3} {...register('notes')} />
        {errors.notes && <small role="alert">{errors.notes.message}</small>}
      </label>

      <label>
        Instructions
        <textarea rows={6} {...register('instructions')} />
      </label>

      <button type="submit" disabled={isSubmitting || update.isPending}>
        {update.isPending ? 'Saving' : 'Save'}
      </button>
    </form>
  );
}
