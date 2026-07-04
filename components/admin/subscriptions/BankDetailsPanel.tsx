'use client';

import { useEffect, useState } from 'react';
import {
  getPlanConfig,
  updatePlanConfig,
} from '@/services/admin-plan-config.service';

export default function BankDetailsPanel({ token }: { token: string }) {
  const [bankDetails, setBankDetails] = useState({
    bankName: '',
    accountName: '',
    accountNumber: '',
    instructions: '',
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const data = await getPlanConfig(token);
      setBankDetails(data.bankDetails || {});
      setLoading(false);
    })();
  }, []);

  const updateField = (key: string, value: string) => {
    setBankDetails((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const save = async () => {
    await updatePlanConfig(token, {
      bankDetails,
    });

    alert('Bank details updated successfully');
  };

  if (loading) return <p>Loading bank details...</p>;

  return (
    <div className="p-4 border rounded space-y-4">
      <h2 className="text-xl font-bold">Bank Details</h2>

      <input
        placeholder="Bank Name"
        value={bankDetails.bankName}
        onChange={(e) => updateField('bankName', e.target.value)}
        className="input"
      />

      <input
        placeholder="Account Name"
        value={bankDetails.accountName}
        onChange={(e) => updateField('accountName', e.target.value)}
        className="input"
      />

      <input
        placeholder="Account Number"
        value={bankDetails.accountNumber}
        onChange={(e) => updateField('accountNumber', e.target.value)}
        className="input"
      />

      <textarea
        placeholder="Payment Instructions"
        value={bankDetails.instructions}
        onChange={(e) => updateField('instructions', e.target.value)}
        className="input"
      />

      <button
        onClick={save}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        Save Bank Details
      </button>
    </div>
  );
}