import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { recipeUpdateSchema, type RecipeUpdateFormValues } from '@/features/recipes/schemas/recipe';
import { useUpdateRecipe } from '@/features/recipes/hooks/useRecipes';
import type { Database } from '@/types/supabase.types';

type Recipe = Database['public']['Tables']['recipes']['Row'];

export function RecipeUpdateForm({ recipe }: { recipe: Recipe }) {
  const update = useUpdateRecipe(recipe.id);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
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
      await update.mutateAsync({
        ...values,
        total_time: values.total_time ?? undefined,
        notes: values.notes ?? undefined,
        image_url: values.image_url ?? undefined,
        instructions: values.instructions,
      });
    } catch (error) {
      console.error('Update failed:', error);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <label>
        Name
        <input type="text" {...register('name')} aria-invalid={!!errors.name} />
        {errors.name && <small role="alert">{errors.name.message}</small>}
      </label>

      <label>
        Servings
        <input
          type="number"
          inputMode="numeric"
          min={1}
          {...register('serving_size', { valueAsNumber: true })}
          aria-invalid={!!errors.serving_size}
        />
        {errors.serving_size && <small role="alert">{errors.serving_size.message}</small>}
      </label>

      <label>
        Total time (minutes)
        <input
          type="number"
          inputMode="numeric"
          min={0}
          {...register('total_time', { valueAsNumber: true })}
          aria-invalid={!!errors.total_time}
        />
        {errors.total_time && <small role="alert">{errors.total_time.message}</small>}
      </label>

      <label>
        Notes
        <textarea rows={3} {...register('notes')} aria-invalid={!!errors.notes} />
        {errors.notes && <small role="alert">{errors.notes.message}</small>}
      </label>

      <label>
        Instructions
        <textarea rows={6} {...register('instructions')} />
      </label>

      <button type="submit" disabled={isSubmitting || update.isPending || !isDirty}>
        {update.isPending ? 'Saving' : 'Save'}
      </button>
    </form>
  );
}
