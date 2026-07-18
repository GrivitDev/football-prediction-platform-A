import api from '@/lib/axios';


export const uploadService = {


  async uploadPaymentProof(file:File){

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
          headers:{
            'Content-Type':'multipart/form-data',
          },
        },
      );


    return res.data.data;

  },


};