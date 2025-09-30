import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { listRecipes, createRecipe } from '../api/recipes';
import type { RecipeCreateInput } from '../schemas/recipe';

const QUERY_KEY = ['recipes', 'list'];

export function useRecipes() {
  return useQuery({ queryKey: QUERY_KEY, queryFn: listRecipes });
}

export function useCreateRecipe() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: RecipeCreateInput) => createRecipe(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  });
}
