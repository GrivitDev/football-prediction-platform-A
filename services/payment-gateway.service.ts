import api from '@/lib/axios';

// =====================================================
// TYPES
// =====================================================

export type PaymentGateway = 'paystack' | 'opay';

export type PaymentCurrency = 'NGN' | 'USD';

export type PaymentType = 'subscription' | 'vip_upgrade';

// Currency is intentionally not accepted here.
// The backend determines currency from the authenticated user's account.
export interface InitializePaymentPayload {
  gateway: PaymentGateway;
  type: PaymentType;
  target: string;
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
