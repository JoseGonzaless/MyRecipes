import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { recipeCreateSchema, type RecipeCreateInput } from '../schemas/recipe';
import { useCreateRecipe } from '../hooks/useRecipes';

export function RecipeCreateForm() {
  const create = useCreateRecipe();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<RecipeCreateInput>({
    resolver: zodResolver(recipeCreateSchema),
    defaultValues: { name: '', serving_size: 1 },
  });

  async function onSubmit(values: RecipeCreateInput) {
    setServerError(null);
    try {
      await create.mutateAsync(values);
      reset({ name: '', serving_size: 1 });
    } catch (e: any) {
      setServerError(e?.message ?? 'Failed to create recipe.');
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <label>
        Recipe name
        <input type="text" autoComplete="off" {...register('name')} />
        {errors.name && <small role="alert">{errors.name.message}</small>}
      </label>

      <label>
        Serving size
        <input type="number" inputMode="numeric" min={1} {...register('serving_size', { valueAsNumber: true })} />
        {errors.serving_size && <small role="alert">{errors.serving_size.message}</small>}
      </label>

      {serverError && <p role="alert">{serverError}</p>}

      <button type="submit" disabled={isSubmitting || create.isPending}>
        {create.isPending ? 'Adding…' : 'Add Recipe'}
      </button>
    </form>
  );
}
