import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { listRecipes, createRecipe, getRecipe, updateRecipe } from '@/features/recipes/api/recipes';
import type { RecipeCreateInput, RecipeUpdateInput } from '@/features/recipes/schemas/recipe';

const qk = {
  recipes: ['recipes'] as const,
  recipe: (id: string) => ['recipes', id] as const,
};

export function useRecipes() {
  return useQuery({
    queryKey: qk.recipes,
    queryFn: listRecipes,
  });
}

export function useCreateRecipe() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: RecipeCreateInput) => createRecipe(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.recipes });
    },
  });
}

export function useRecipe(id: string) {
  return useQuery({
    queryKey: qk.recipe(id),
    queryFn: () => getRecipe(id),
    enabled: !!id,
  });
}

export function useUpdateRecipe(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (patch: RecipeUpdateInput) => updateRecipe(id, patch),
    onSuccess: (data) => {
      qc.setQueryData(qk.recipe(id), data);
      qc.invalidateQueries({ queryKey: qk.recipes });
    },
  });
}
