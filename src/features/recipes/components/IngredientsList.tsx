import { useCallback } from 'react';

import {
  useRecipeIngredients,
  useUpdateIngredient,
  useDeleteIngredient,
} from '@/features/recipes/hooks/useRecipeIngredients';

import type { IngredientUpdateInput } from '@/features/recipes/schemas/recipeIngredients';
import IngredientRow from '@/features/recipes/components/IngredientRow';

export function IngredientsList({ recipeId }: { recipeId: string }) {
  const { data: items = [], isLoading, isError } = useRecipeIngredients(recipeId);
  const update = useUpdateIngredient(recipeId);
  const remove = useDeleteIngredient(recipeId);

  const save = useCallback(
    async (id: string, patch: IngredientUpdateInput) => {
      await update.mutateAsync({ id, patch });
    },
    [update]
  );

  const onDelete = useCallback((id: string) => remove.mutate(id), [remove]);

  if (isLoading) return <p>Loading ingredients…</p>;
  if (isError) return <p role="alert">Failed to load ingredients.</p>;
  if (items.length === 0) return <p>No ingredients yet.</p>;

  return (
    <article>
      {items.map((row) => (
        <p key={row.id}>
          <IngredientRow row={row} onSave={save} onDelete={onDelete} />
          <hr />
        </p>
      ))}
    </article>
  );
}
