'use client';

import { useRef, useState, type ChangeEvent } from 'react';
import { CheckCircle2, Loader2, UploadCloud, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { uploadService } from '@/services/uploads.service';

interface PaymentProofUploadProps {
  onUpload: (data: { url: string; publicId: string }) => void;
}

export default function PaymentProofUpload({ onUpload }: PaymentProofUploadProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [fileName, setFileName] = useState('');

  const resetUpload = () => {
    setUploaded(false);
    setFileName('');
    if (inputRef.current) inputRef.current.value = '';
  };

  const handleUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
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
    <div className="rounded-xl border border-dashed bg-card/50 p-4 text-center">
      {uploaded ? (
        <div className="flex flex-col items-center gap-2">
          <CheckCircle2 className="h-8 w-8 text-green-500" />
          <p className="max-w-full truncate text-sm font-medium">{fileName}</p>
          <p className="text-xs text-muted-foreground">Payment proof uploaded</p>
          <button type="button" onClick={resetUpload} className="mt-1 inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs transition hover:bg-muted">
            <XCircle className="h-3.5 w-3.5" /> Replace
          </button>
        </div>
      ) : (
        <>
          {uploading ? <Loader2 className="mx-auto mb-2 h-8 w-8 animate-spin text-primary" /> : <UploadCloud className="mx-auto mb-2 h-8 w-8 text-primary" />}
          <p className="text-sm font-semibold">Payment Proof</p>
          <p className="mb-3 text-xs text-muted-foreground">JPG, PNG, WEBP or PDF · Max 5MB</p>
          <label className="inline-flex cursor-pointer items-center rounded-lg border px-4 py-1.5 text-xs transition hover:bg-muted">
            Select File
            <input ref={inputRef} type="file" accept="image/png,image/jpeg,image/webp,application/pdf" hidden disabled={uploading} onChange={handleUpload} />
          </label>
        </>
      )}
    </div>
  );
}
