import { supabase } from '@/config/supabase';
import type { RecipeCreateInput, RecipeUpdateInput } from '@/features/recipes/schemas/recipe';
import type { Database } from '@/types/supabase.types';

type Recipe = Database['public']['Tables']['recipes']['Row'];
type RecipeInsert = Database['public']['Tables']['recipes']['Insert'];
type RecipeUpdate = Database['public']['Tables']['recipes']['Update'];

export async function listRecipes(): Promise<Recipe[]> {
  const { data, error } = await supabase.from('recipes').select('*').order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}

export async function getRecipe(id: string): Promise<Recipe> {
  const { data, error } = await supabase.from('recipes').select('*').eq('id', id).single();

  if (error) {
    throw new Error(error.message);
  }

  return data!;
}

export async function createRecipe(input: RecipeCreateInput): Promise<Recipe> {
  const payload: Omit<RecipeInsert, 'owner_id'> = {
    name: input.name,
    serving_size: input.serving_size,
    total_time: input.total_time ? String(input.total_time) : undefined,
    notes: input.notes,
    image_url: input.image_url,
    instructions: normalizeInstructions(input.instructions),
  };

  const { data, error } = await supabase.from('recipes').insert(payload).select('*').single();

  if (error) {
    throw new Error(error.message);
  }

  return data!;
}

export async function updateRecipe(id: string, patch: RecipeUpdateInput): Promise<Recipe> {
  const updatePayload = buildUpdatePayload(patch);

  const { data, error } = await supabase.from('recipes').update(updatePayload).eq('id', id).select('*').single();

  if (error) {
    throw new Error(error.message);
  }

  return data!;
}

export async function deleteRecipe(id: string): Promise<void> {
  const { error } = await supabase.from('recipes').delete().eq('id', id);

  if (error) {
    throw new Error(error.message);
  }
}

export async function uploadRecipeImage(file: File, recipeId: string, userId: string): Promise<string> {
  const ext = file.name.split('.').pop() || 'jpg';
  const path = `${userId}/${recipeId}/${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage.from('recipe-images').upload(path, file);

  if (error) {
    throw new Error(error.message);
  }

  return path;
}

export async function updateRecipeImage(id: string, imageUrl: string | null | undefined): Promise<Recipe> {
  const updatePayload: Partial<RecipeUpdate> = {
    image_url: imageUrl ?? null,
  };

  const { data, error } = await supabase.from('recipes').update(updatePayload).eq('id', id).select('*').single();

  if (error) {
    throw new Error(error.message);
  }

  return data!;
}

export async function createSignedImageUrl(path: string, expiresIn = 3600): Promise<string> {
  const { data, error } = await supabase.storage.from('recipe-images').createSignedUrl(path, expiresIn);

  if (error) {
    throw new Error(error.message);
  }

  return data.signedUrl;
}

// Helper function to build update payload
function buildUpdatePayload(patch: RecipeUpdateInput): Partial<RecipeUpdate> {
  const payload: Partial<RecipeUpdate> = {};

  if (patch.name !== undefined) {
    payload.name = patch.name;
  }
  if (patch.serving_size !== undefined) {
    payload.serving_size = patch.serving_size;
  }
  if (patch.total_time !== undefined) {
    payload.total_time = patch.total_time === null ? null : String(patch.total_time);
  }
  if (patch.notes !== undefined) {
    payload.notes = patch.notes ?? null;
  }
  if (patch.image_url !== undefined) {
    payload.image_url = patch.image_url ?? null;
  }
  if (patch.instructions !== undefined) {
    payload.instructions = normalizeInstructions(patch.instructions);
  }

  return payload;
}

function normalizeInstructions(v: string | string[] | null | undefined): string[] | null {
  if (v == null) {
    return null;
  }

  // If textarea string: split into lines
  const arr = Array.isArray(v) ? v : v.split(/\r?\n/);

  const cleaned = arr.map((s) => s.trim()).filter(Boolean);
  return cleaned.length ? cleaned : null;
}
