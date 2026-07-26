import { Suspense } from 'react';

import VerifyPaymentClient from './VerifyPaymentClient';

export default function VerifyPaymentPage() {
  return (
    <Suspense fallback={<div>Verifying payment...</div>}>
      <VerifyPaymentClient />
    </Suspense>
  );
}