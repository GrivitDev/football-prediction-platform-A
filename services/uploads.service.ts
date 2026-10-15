// frontend/services/uploads.service.ts

import api from '@/lib/axios';

export interface UploadedImage {
  url: string;
  publicId: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
}

export const uploadService = {
  async uploadPaymentProof(
    file: File,
  ) {
    const formData =
      new FormData();

    formData.append(
      'image',
      file,
    );

    const res =
      await api.post(
        '/uploads/payment-proof',
        formData,
        {
          headers: {
            'Content-Type':
              'multipart/form-data',
          },
        },
      );

    return res.data.data;
  },

  async uploadCommunityMedia(
    file: File,
  ) {
    const formData =
      new FormData();

    formData.append(
      'media',
      file,
    );

    const res =
      await api.post(
        '/uploads/community',
        formData,
        {
          headers: {
            'Content-Type':
              'multipart/form-data',
          },
        },
      );

    return res.data.data;
  },

  async uploadArticleImage(
    file: File,
  ): Promise<UploadedImage> {
    const formData =
      new FormData();

    formData.append(
      'image',
      file,
    );

    const res =
      await api.post(
        '/uploads/articles',
        formData,
        {
          headers: {
            'Content-Type':
              'multipart/form-data',
          },
        },
      );

    return res.data.data;
  },
};