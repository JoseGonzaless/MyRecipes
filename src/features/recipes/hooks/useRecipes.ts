import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import {
  listRecipes,
  createRecipe,
  getRecipe,
  updateRecipe,
  deleteRecipe,
  uploadRecipeImage,
  createSignedImageUrl,
  updateRecipeImage,
} from '@/features/recipes/api/recipes';
import type { RecipeCreateInput, RecipeUpdateInput } from '@/features/recipes/schemas/recipe';

const CACHE_TIMES = {
  IMAGE_STALE: 45 * 60 * 1000, // 45 minutes
  IMAGE_GC: 2 * 60 * 60 * 1000, // 2 hours
} as const;

const qk = {
  recipes: ['recipes'] as const,
  recipe: (id: string) => ['recipes', id] as const,
  image: (path: string | null | undefined) => ['recipe-image', path ?? ''] as const,
} as const;

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

export function useDeleteRecipe() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteRecipe(id),
    onSuccess: (_void, id) => {
      qc.removeQueries({ queryKey: qk.recipe(id) });
      qc.invalidateQueries({ queryKey: qk.recipes });
    },
  });
}

export function useUpdateRecipeImage(recipeId: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (args: { file?: File; userId?: string; imageUrl?: string | null }) => {
      if (args.file && args.userId) {
        // Upload new image
        const path = await uploadRecipeImage(args.file, recipeId, args.userId);

        return await updateRecipeImage(recipeId, path);
      } else {
        // Update existing image URL
        return await updateRecipeImage(recipeId, args.imageUrl);
      }
    },
    onSuccess: (updated) => {
      qc.setQueryData(qk.recipe(updated.id), updated);
      qc.invalidateQueries({ queryKey: qk.recipes });
    },
  });
}

export function useUploadRecipeImage() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({ file, recipeId, userId }: { file: File; recipeId: string; userId: string }) => {
      const path = await uploadRecipeImage(file, recipeId, userId);
      return await updateRecipeImage(recipeId, path);
    },
    onSuccess: (updated) => {
      qc.setQueryData(qk.recipe(updated.id), updated);
      qc.invalidateQueries({ queryKey: qk.recipes });
    },
  });
}

export function useSignedRecipeImage(path: string | null | undefined) {
  return useQuery({
    queryKey: qk.image(path),
    enabled: !!path,
    queryFn: () => createSignedImageUrl(path as string, 60 * 60),
    staleTime: CACHE_TIMES.IMAGE_STALE,
    gcTime: CACHE_TIMES.IMAGE_GC,
    refetchOnWindowFocus: false,
  });
}
