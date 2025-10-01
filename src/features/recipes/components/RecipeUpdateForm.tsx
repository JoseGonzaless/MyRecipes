import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { recipeUpdateSchema, type RecipeUpdateInput } from '@/features/recipes/schemas/recipe';
import { useUpdateRecipe } from '@/features/recipes/hooks/useRecipes';
import type { Database } from '@/types/supabase.types';

type Recipe = Database['public']['Tables']['recipes']['Row'];

export function RecipeUpdateForm({ recipe }: { recipe: Recipe }) {
  const update = useUpdateRecipe(recipe.id);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
    reset,
  } = useForm<RecipeUpdateInput>({
    resolver: zodResolver(recipeUpdateSchema),
    defaultValues: { name: recipe.name ?? '', serving_size: recipe.serving_size ?? 1 },
  });

  useEffect(() => {
    if (!isDirty) {
      reset({ name: recipe.name ?? '', serving_size: recipe.serving_size ?? 1 });
    }
  }, [recipe.id, recipe.name, recipe.serving_size, reset, isDirty]);

  async function onSubmit(values: RecipeUpdateInput) {
    await update.mutateAsync(values);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <label>
        Name
        <input type="text" {...register('name')} aria-invalid={!!errors.name} />
        {errors.name && <small role="alert">{errors.name.message}</small>}
      </label>

      <label>
        <span>Servings</span>
        <input
          type="number"
          inputMode="numeric"
          min={1}
          {...register('serving_size', { valueAsNumber: true })}
          aria-invalid={!!errors.serving_size}
        />
        {errors.serving_size && <small role="alert">{errors.serving_size.message}</small>}
      </label>

      <button type="submit" disabled={isSubmitting || update.isPending || !isDirty}>
        {update.isPending ? 'Saving…' : 'Save'}
      </button>
    </form>
  );
}
