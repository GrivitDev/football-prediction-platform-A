import type { PlanConfig } from '@/types/plan-config';

const API = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, '');

interface BankDetailsPayload {
  bankName: string;
  accountName: string;
  accountNumber: string;
  instructions: string;
}

interface PlanLabelsPayload {
  free: string;
  regular: string;
  vip: string;
  premium: string;
}

export interface UpdatePlanConfigPayload {
  regularPrice?: number;
  vipPrice?: number;
  premiumPrice?: number;

  regularPriceUSD?: number;
  vipPriceUSD?: number;
  premiumPriceUSD?: number;

  bankDetails?: BankDetailsPayload;
  bankDetailsUSD?: BankDetailsPayload;

  subscriptionDurationDays?: number;
  premiumDurationDays?: number;

  planLabels?: PlanLabelsPayload;
}

interface ApiErrorResponse {
  message?: string | string[];
  error?: string;
  statusCode?: number;
}

function getEndpoint(): string {
  if (!API) {
    throw new Error('NEXT_PUBLIC_API_URL is not configured.');
  }

  return `${API}/plan-config`;
}

function getErrorMessage(
  body: unknown,
  status: number,
): string {
  if (body && typeof body === 'object') {
    const response = body as ApiErrorResponse;

    if (Array.isArray(response.message)) {
      return response.message.join(', ');
    }

    if (typeof response.message === 'string') {
      return response.message;
    }

    if (typeof response.error === 'string') {
      return response.error;
    }
  }

  return `Request failed with status ${status}.`;
}

async function parseResponse<T>(
  response: Response,
): Promise<T> {
  const responseText = await response.text();

  let body: unknown = null;

  if (responseText) {
    try {
      body = JSON.parse(responseText);
    } catch {
      if (!response.ok) {
        throw new Error(
          `Request failed with status ${response.status}.`,
        );
      }

      throw new Error('The server returned an invalid response.');
    }
  }

  if (!response.ok) {
    throw new Error(
      getErrorMessage(body, response.status),
    );
  }

  if (body === null) {
    throw new Error('The server returned an empty response.');
  }

  return body as T;
}

/**
 * Returns the public subscription and pricing configuration.
 */
export async function getPlanConfig(
  token: string,
): Promise<PlanConfig> {
  const response = await fetch(getEndpoint(), {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
  });

  return parseResponse<PlanConfig>(response);
}

/**
 * Removes MongoDB metadata and sends only fields
 * accepted by UpdatePlanConfigDto.
 */
function sanitizeUpdatePayload(
  data: UpdatePlanConfigPayload,
): UpdatePlanConfigPayload {
  return {
    regularPrice: data.regularPrice,
    vipPrice: data.vipPrice,
    premiumPrice: data.premiumPrice,

    regularPriceUSD: data.regularPriceUSD,
    vipPriceUSD: data.vipPriceUSD,
    premiumPriceUSD: data.premiumPriceUSD,

    bankDetails: data.bankDetails
      ? {
          bankName: data.bankDetails.bankName,
          accountName: data.bankDetails.accountName,
          accountNumber: data.bankDetails.accountNumber,
          instructions: data.bankDetails.instructions,
        }
      : undefined,

    bankDetailsUSD: data.bankDetailsUSD
      ? {
          bankName: data.bankDetailsUSD.bankName,
          accountName: data.bankDetailsUSD.accountName,
          accountNumber: data.bankDetailsUSD.accountNumber,
          instructions: data.bankDetailsUSD.instructions,
        }
      : undefined,

    subscriptionDurationDays: data.subscriptionDurationDays,
    premiumDurationDays: data.premiumDurationDays,

    planLabels: data.planLabels
      ? {
          free: data.planLabels.free,
          regular: data.planLabels.regular,
          vip: data.planLabels.vip,
          premium: data.planLabels.premium,
        }
      : undefined,
  };
}

/**
 * Updates subscription configuration.
 *
 * Supports partial updates, including individual
 * pricing and bank configuration changes.
 */
export async function updatePlanConfig(
  token: string,
  data: UpdatePlanConfigPayload,
): Promise<PlanConfig> {
  const payload = sanitizeUpdatePayload(data);

  const response = await fetch(getEndpoint(), {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
    body: JSON.stringify(payload),
  });

  return parseResponse<PlanConfig>(response);
}