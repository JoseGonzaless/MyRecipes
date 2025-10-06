import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { useCreateRecipe, useUploadRecipeImage } from '../hooks/useRecipes';
import { recipeCreateSchema, type RecipeCreateFormValues } from '../schemas/recipe';

export function RecipeCreateForm() {
  const create = useCreateRecipe();
  const uploadImage = useUploadRecipeImage();
  const [serverError, setServerError] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<RecipeCreateFormValues>({
    resolver: zodResolver(recipeCreateSchema),
    defaultValues: {
      name: '',
      serving_size: 1,
      total_time: undefined,
      notes: undefined,
      image_url: undefined,
      instructions: undefined,
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    setFileError(null);

    if (selectedFile) {
      if (!selectedFile.type.startsWith('image/')) {
        setFileError('Please select an image file');
        return;
      }

      if (selectedFile.size > 5 * 1024 * 1024) {
        // 5MB limit
        setFileError('File size must be less than 5MB');
        return;
      }

      setFile(selectedFile);
    }
  };

  async function onSubmit(values: RecipeCreateFormValues) {
    setServerError(null);
    setFileError(null);

    try {
      const parsed = recipeCreateSchema.parse(values);
      const recipe = await create.mutateAsync(parsed);

      // Upload image if provided
      if (file) {
        try {
          await uploadImage.mutateAsync({
            file,
            recipeId: recipe.id,
            userId: recipe.owner_id,
          });
        } catch (e: any) {
          setServerError(e?.message ?? 'Recipe created but image upload failed. Please try uploading the image again.');
          return;
        }
      }

      // Reset form
      reset({
        name: '',
        serving_size: 1,
        total_time: undefined,
        notes: undefined,
        image_url: undefined,
        instructions: undefined,
      });
      setFile(null);
    } catch (error) {
      console.error('Failed to create recipe:', error);
    }
  }

  const busy = isSubmitting || create.isPending;

  return (
    <form onSubmit={handleSubmit(onSubmit)} aria-busy={busy}>
      <article>
        <h2>Create a Recipe</h2>

        <fieldset role="group" style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
          <label style={{ flex: '2 1 24rem' }}>
            Recipe Name
            <input
              type="text"
              autoComplete="off"
              {...register('name')}
              aria-invalid={!!errors.name || undefined}
              style={{ marginBottom: '1rem' }}
              disabled={busy}
            />
            {errors.name && <small role="alert">{errors.name.message}</small>}
          </label>

          <div style={{ display: 'flex', flex: '1 1 16rem', gap: '1rem' }}>
            <label style={{ flex: '1 1 8rem' }}>
              Serving Size
              <input
                type="number"
                inputMode="numeric"
                min={1}
                {...register('serving_size', { valueAsNumber: true })}
                aria-invalid={!!errors.serving_size || undefined}
                style={{ marginBottom: '1rem' }}
                disabled={busy}
              />
              {errors.serving_size && <small role="alert">{errors.serving_size.message}</small>}
            </label>

            <label style={{ flex: '1 1 8rem' }}>
              Total Time (min)
              <input
                type="number"
                inputMode="numeric"
                min={0}
                {...register('total_time', { valueAsNumber: true })}
                aria-invalid={!!errors.total_time || undefined}
                style={{ marginBottom: '1rem' }}
                disabled={busy}
              />
              {errors.total_time && <small role="alert">{errors.total_time.message}</small>}
            </label>
          </div>
        </fieldset>

        <label>
          Notes
          <textarea rows={3} {...register('notes')} disabled={busy} />
          {errors.notes && <small role="alert">{errors.notes.message}</small>}
        </label>

        <label>
          Instructions
          <textarea rows={6} {...register('instructions')} disabled={busy} />
        </label>

        <label>
          Cover Image
          <input type="file" accept="image/*" onChange={handleFileChange} disabled={busy || uploadImage.isPending} />
          {fileError && <small role="alert">{fileError}</small>}
        </label>

        {serverError && <p role="alert">{serverError}</p>}

        <button type="submit" disabled={busy || uploadImage.isPending}>
          {(() => {
            if (create.isPending) {
              return 'Adding';
            }
            if (uploadImage.isPending) {
              return 'Uploading Image';
            }
            return 'Add Recipe';
          })()}
        </button>
      </article>
    </form>
  );
}
