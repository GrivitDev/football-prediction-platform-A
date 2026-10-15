// frontend/components/articles/ArticleFeaturedImage.tsx

'use client';

import {
  useEffect,
  useRef,
  useState,
} from 'react';

import Image from 'next/image';

import {
  Image as ImageIcon,
  Loader2,
  Upload,
  X,
} from 'lucide-react';

import { toast } from 'sonner';

import {
  uploadService,
} from '@/services/uploads.service';

interface ArticleFeaturedImageProps {
  imageUrl: string;
  imageAlt: string;
  onImageUploaded: (
    data: {
      url: string;
      publicId: string;
    },
  ) => void;
  onRemove: () => void;
  disabled?: boolean;
}

const MAX_IMAGE_SIZE =
  5 * 1024 * 1024;

const ALLOWED_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
];

export default function ArticleFeaturedImage({
  imageUrl,
  imageAlt,
  onImageUploaded,
  onRemove,
  disabled = false,
}: ArticleFeaturedImageProps) {
  const inputRef =
    useRef<HTMLInputElement>(null);

  const previewUrlRef =
    useRef<string | null>(null);

  const [
    localPreview,
    setLocalPreview,
  ] = useState<{
    imageUrl: string;
    preview: string;
  } | null>(null);

  const [
    uploading,
    setUploading,
  ] = useState(false);

  const preview =
    localPreview?.imageUrl ===
    imageUrl
      ? localPreview.preview
      : imageUrl;

  useEffect(() => {
    return () => {
      if (
        previewUrlRef.current
      ) {
        URL.revokeObjectURL(
          previewUrlRef.current,
        );
      }
    };
  }, []);

  const clearLocalPreview =
    () => {
      if (
        previewUrlRef.current
      ) {
        URL.revokeObjectURL(
          previewUrlRef.current,
        );

        previewUrlRef.current =
          null;
      }

      setLocalPreview(null);
    };

  const handleFile = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    if (
      !ALLOWED_TYPES.includes(
        file.type,
      )
    ) {
      toast.error(
        'Please choose a JPG, PNG, or WebP image.',
      );

      event.target.value = '';

      return;
    }

    if (
      file.size >
      MAX_IMAGE_SIZE
    ) {
      toast.error(
        'The image must be 5MB or smaller.',
      );

      event.target.value = '';

      return;
    }

    clearLocalPreview();

    const objectPreview =
      URL.createObjectURL(file);

    previewUrlRef.current =
      objectPreview;

    setLocalPreview({
      imageUrl,
      preview: objectPreview,
    });

    setUploading(true);

    try {
      const uploaded =
        await uploadService.uploadArticleImage(
          file,
        );

      onImageUploaded({
        url: uploaded.url,
        publicId:
          uploaded.publicId,
      });

      clearLocalPreview();

      toast.success(
        'Featured image uploaded.',
      );
    } catch (error: any) {
      clearLocalPreview();

      toast.error(
        error?.response?.data?.message ||
          'Unable to upload the featured image.',
      );
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  };

  const handleRemove = () => {
    if (uploading) {
      return;
    }

    clearLocalPreview();
    onRemove();
  };

  return (
    <div className="space-y-2.5">
      {preview ? (
        <div className="relative overflow-hidden rounded-md border border-border bg-muted/30">
          <div className="flex min-h-[90px] items-center justify-center p-1.5 sm:min-h-[110px]">
            <Image
              src={preview}
              alt={
                imageAlt ||
                'Featured image preview'
              }
              width={1200}
              height={675}
              unoptimized
              className="block h-auto max-h-[180px] w-full object-contain"
            />
          </div>

          <button
            type="button"
            disabled={
              disabled ||
              uploading
            }
            onClick={
              handleRemove
            }
            aria-label="Remove featured image"
            title="Remove featured image"
            className="absolute right-1.5 top-1.5 inline-flex h-7 w-7 items-center justify-center rounded-md bg-destructive text-destructive-foreground shadow-sm transition hover:opacity-90 disabled:pointer-events-none disabled:opacity-50"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ) : (
        <div className="flex min-h-[95px] items-center justify-center rounded-md border border-dashed border-border bg-muted/20 px-3 py-4">
          <div className="text-center">
            <ImageIcon className="mx-auto h-6 w-6 text-muted-foreground" />

            <p className="mt-1.5 text-[11px] font-medium text-foreground">
              No featured image selected
            </p>

            <p className="mt-0.5 text-[10px] text-muted-foreground">
              Example: a photo that represents the article.
            </p>
          </div>
        </div>
      )}

      <input
        ref={inputRef}
        hidden
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFile}
        disabled={
          disabled ||
          uploading
        }
      />

      <button
        type="button"
        disabled={
          disabled ||
          uploading
        }
        onClick={() =>
          inputRef.current?.click()
        }
        className="inline-flex h-8 w-full items-center justify-center gap-1.5 rounded-md border border-border bg-background px-2.5 text-[11px] font-medium text-foreground transition hover:bg-muted disabled:pointer-events-none disabled:opacity-50"
      >
        {uploading ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : preview ? (
          <ImageIcon className="h-3.5 w-3.5" />
        ) : (
          <Upload className="h-3.5 w-3.5" />
        )}

        {uploading
          ? 'Uploading...'
          : preview
            ? 'Change image'
            : 'Choose image'}
      </button>

      <p className="text-center text-[10px] text-muted-foreground">
        JPG, PNG or WebP · maximum 5MB
      </p>
    </div>
  );
}