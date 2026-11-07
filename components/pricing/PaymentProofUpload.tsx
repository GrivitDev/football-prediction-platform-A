'use client';

import { useRef, useState, type ChangeEvent } from 'react';
import {
  CheckCircle2,
  Loader2,
  UploadCloud,
  XCircle,
} from 'lucide-react';
import toast from 'react-hot-toast';

import { uploadService } from '@/services/uploads.service';

interface PaymentProofUploadProps {
  onUpload: (data: { url: string; publicId: string }) => void;
  onClear?: () => void;
}

export default function PaymentProofUpload({
  onUpload,
  onClear,
}: PaymentProofUploadProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [fileName, setFileName] = useState('');

  const resetUpload = () => {
    setUploaded(false);
    setFileName('');
    if (inputRef.current) inputRef.current.value = '';
    onClear?.();
  };

  const handleUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'application/pdf',
    ];

    if (!allowedTypes.includes(file.type)) {
      toast.error('Only JPG, PNG, WEBP images or PDF files are allowed.');
      event.target.value = '';
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB.');
      event.target.value = '';
      return;
    }

    try {
      setUploading(true);
      setFileName(file.name);

      const result = await uploadService.uploadPaymentProof(file);
      onUpload({ url: result.url, publicId: result.publicId });
      setUploaded(true);
      toast.success('Payment proof uploaded successfully.');
    } catch (error) {
      console.error(error);
      setUploaded(false);
      setFileName('');
      if (inputRef.current) inputRef.current.value = '';
      toast.error('Unable to upload payment proof.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="rounded-xl border border-dashed bg-card/50 px-3 py-3">
      {uploaded ? (
        <div className="flex min-w-0 items-center gap-3">
          <CheckCircle2 className="h-5 w-5 shrink-0 text-green-500" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-semibold">{fileName}</p>
            <p className="mt-0.5 text-[11px] text-muted-foreground">
              Payment proof uploaded
            </p>
          </div>
          <button
            type="button"
            onClick={resetUpload}
            className="inline-flex min-h-8 shrink-0 items-center gap-1 rounded-lg border px-2.5 text-[11px] font-medium transition hover:bg-muted"
          >
            <XCircle className="h-3.5 w-3.5" />
            Replace
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            {uploading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <UploadCloud className="h-4 w-4" />
            )}
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold">Payment proof</p>
            <p className="mt-0.5 text-[11px] leading-4 text-muted-foreground">
              JPG, PNG, WEBP or PDF · Max 5MB
            </p>
          </div>
          <label className="inline-flex min-h-9 shrink-0 cursor-pointer items-center rounded-lg border px-3 text-xs font-semibold transition hover:bg-muted">
            {uploading ? 'Uploading...' : 'Select file'}
            <input
              ref={inputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,application/pdf"
              hidden
              disabled={uploading}
              onChange={handleUpload}
            />
          </label>
        </div>
      )}
    </div>
  );
}
