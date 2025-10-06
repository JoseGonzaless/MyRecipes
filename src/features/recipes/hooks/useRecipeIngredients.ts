import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import {
  listIngredients,
  insertIngredient,
  updateIngredient,
  deleteIngredient,
} from '@/features/recipes/api/recipeIngredients';
import type { IngredientCreateInput, IngredientUpdateInput } from '@/features/recipes/schemas/recipeIngredients';
import type { Database } from '@/types/supabase.types';

type Ingredient = Database['public']['Tables']['recipe_ingredients']['Row'];

export const qk = {
  ingredients: (recipeId: string) => ['recipes', recipeId, 'ingredients'] as const,
};

function getList(qc: ReturnType<typeof useQueryClient>, key: readonly unknown[]) {
  return (qc.getQueryData(key) as Ingredient[] | undefined) ?? [];
}
function setList(
  qc: ReturnType<typeof useQueryClient>,
  key: readonly unknown[],
  updater: (old: Ingredient[]) => Ingredient[]
) {
  qc.setQueryData<Ingredient[] | undefined>(key, (old) => updater(old ?? []));
}

export function useRecipeIngredients(recipeId: string) {
  return useQuery({
    queryKey: qk.ingredients(recipeId),
    queryFn: () => listIngredients(recipeId),
    enabled: !!recipeId,
  });
}

export function useCreateIngredient(recipeId: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (values: IngredientCreateInput) => insertIngredient(recipeId, values),

    onMutate: async (values) => {
      const key = qk.ingredients(recipeId);
      await qc.cancelQueries({ queryKey: key });

      const prev = getList(qc, key);

      const tempId = `temp-${Math.random().toString(36).slice(2)}`;
      const temp: Ingredient = {
        id: tempId,
        recipe_id: recipeId,
        owner_id: 'temp',
        name: values.name,
        quantity: values.quantity ?? 0,
        unit: values.unit ?? null,
        notes: values.notes ?? null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      } as Ingredient;

      setList(qc, key, (old) => [...old, temp]);
      return { prev, key, tempId };
    },

    onError: (_err, _values, ctx) => {
      if (ctx) {
        qc.setQueryData(ctx.key, ctx.prev);
      }
    },

    onSuccess: (real, _values, ctx) => {
      if (!ctx) {
        return;
      }
      setList(qc, ctx.key, (old) => old.map((row) => (row.id === ctx.tempId ? real : row)));
    },
  });
}

export function useUpdateIngredient(recipeId: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: IngredientUpdateInput }) => updateIngredient(id, patch),

    onMutate: async ({ id, patch }) => {
      const key = qk.ingredients(recipeId);
      await qc.cancelQueries({ queryKey: key });

      const prev = getList(qc, key);

      setList(qc, key, (old) =>
        old.map((r) =>
          r.id === id
            ? {
                ...r,
                ...(patch.name !== undefined ? { name: patch.name } : {}),
                ...(patch.quantity !== undefined ? { quantity: patch.quantity } : {}),
                ...(patch.unit !== undefined ? { unit: patch.unit ?? null } : {}),
                ...(patch.notes !== undefined ? { notes: patch.notes ?? null } : {}),
                updated_at: new Date().toISOString(),
              }
            : r
        )
      );

      return { prev, key };
    },

    onError: (_err, _vars, ctx) => {
      if (ctx) {
        qc.setQueryData(ctx.key, ctx.prev);
      }
    },
  });
}

export function useDeleteIngredient(recipeId: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteIngredient(id),

    onMutate: async (id) => {
      const key = qk.ingredients(recipeId);
      await qc.cancelQueries({ queryKey: key });

      const prev = getList(qc, key);
      setList(qc, key, (old) => old.filter((r) => r.id !== id));

      return { prev, key };
    },

    onError: (_err, _id, ctx) => {
      if (ctx) {
        qc.setQueryData(ctx.key, ctx.prev);
      }
    },
  });
}
