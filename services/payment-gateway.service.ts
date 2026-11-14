import api from '@/lib/axios';

// =====================================================
// TYPES
// =====================================================

export type PaymentGateway = 'paystack' | 'opay';

export type PaymentCurrency = 'NGN' | 'USD';

export type PaymentType = 'subscription' | 'vip_upgrade';

// The backend validates this selection and calculates the corresponding price.
export interface InitializePaymentPayload {
  gateway: PaymentGateway;
  type: PaymentType;
  target: string;
  currency: PaymentCurrency;
}

export interface InitializePaymentResponse {
  authorizationUrl: string;
  accessCode?: string;
  reference: string;
}

export interface VerifyPaymentResponse {
  success?: boolean;
  reference?: string;
  transactionId?: string;
  message?: string;
  status?: string;
  [key: string]: any;
}

// =====================================================
// PAYMENT GATEWAY SERVICE
// =====================================================

const paymentGatewayService = {
  async initializePayment(
    payload: InitializePaymentPayload,
  ): Promise<InitializePaymentResponse> {
    const response = await api.post<InitializePaymentResponse>(
      '/payment-gateways/initialize',
      {
        gateway: payload.gateway,
        type: payload.type,
        target: payload.target,
        currency: payload.currency,
      },
    );

    return response.data;
  },

  async verifyPayment(
    gateway: PaymentGateway,
    reference: string,
  ): Promise<VerifyPaymentResponse> {
    const response = await api.get<VerifyPaymentResponse>(
      `/payment-gateways/${gateway}/verify`,
      {
        params: { reference },
      },
    );

    return response.data;
  },
};

export default paymentGatewayService;
