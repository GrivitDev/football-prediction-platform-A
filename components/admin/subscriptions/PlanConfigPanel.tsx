'use client';

import { useEffect, useState } from 'react';
import {
  getPlanConfig,
  updatePlanConfig,
} from '@/services/admin-plan-config.service';

export default function PlanConfigPanel({ token }: { token: string }) {
  const [config, setConfig] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const data = await getPlanConfig(token);
      setConfig(data);
      setLoading(false);
    })();
  }, []);

  const updateField = (key: string, value: any) => {
    setConfig({ ...config, [key]: value });
  };

  const save = async () => {
    await updatePlanConfig(token, config);
    alert('Updated successfully');
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="space-y-6 p-4 border rounded">
      <h2 className="text-xl font-bold">Plan Configuration</h2>

      <input
        placeholder="Regular Price"
        value={config.regularPrice}
        onChange={(e) => updateField('regularPrice', Number(e.target.value))}
      />

      <input
        placeholder="VIP Price"
        value={config.vipPrice}
        onChange={(e) => updateField('vipPrice', Number(e.target.value))}
      />

      <input
        placeholder="Prediction Price"
        value={config.predictionPrice}
        onChange={(e) =>
          updateField('predictionPrice', Number(e.target.value))
        }
      />

      <input
        placeholder="Subscription Days"
        value={config.subscriptionDurationDays}
        onChange={(e) =>
          updateField('subscriptionDurationDays', Number(e.target.value))
        }
      />

      <button onClick={save} className="bg-blue-600 text-white px-4 py-2">
        Save
      </button>
    </div>
  );
}