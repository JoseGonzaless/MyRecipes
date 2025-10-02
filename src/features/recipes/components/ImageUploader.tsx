import { useState } from 'react';
import { useUpdateRecipeImage, useSignedRecipeImage } from '@/features/recipes/hooks/useRecipes';

export function ImageUploader({
  recipeId,
  ownerId,
  imagePath,
  alt,
}: {
  recipeId: string;
  ownerId: string;
  imagePath: string | null;
  alt: string;
}) {
  const [localFile, setLocalFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { data: url } = useSignedRecipeImage(imagePath);
  const updateImage = useUpdateRecipeImage(recipeId);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setError(null);

    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        setError('File size must be less than 5MB');
        return;
      }

      setLocalFile(file);
    }
  };

  const handleUpload = async () => {
    if (!localFile) return;

    try {
      setError(null);
      await updateImage.mutateAsync({
        file: localFile,
        userId: ownerId,
      });
      setLocalFile(null);
    } catch (error) {
      setError('Upload failed. Please try again.');
      console.error('Upload error:', error);
    }
  };

  const handleRemove = async () => {
    try {
      setError(null);
      await updateImage.mutateAsync({ imageUrl: null });
    } catch (error) {
      setError('Failed to remove image. Please try again.');
      console.error('Remove error:', error);
    }
  };

  return (
    <section>
      {url ? <img src={url} alt={alt} /> : <div>No image</div>}

      {error && <small>{error}</small>}

      <div>
        <input type="file" accept="image/*" onChange={handleFileChange} disabled={updateImage.isPending} />

        <button type="button" onClick={handleUpload} disabled={!localFile || updateImage.isPending}>
          {updateImage.isPending ? 'Uploading' : 'Replace'}
        </button>

        {imagePath && (
          <button type="button" onClick={handleRemove} disabled={updateImage.isPending}>
            {updateImage.isPending ? 'Removing' : 'Remove'}
          </button>
        )}
      </div>
    </section>
  );
}
