'use client';

import { useEffect, useMemo, useState } from 'react';

import {
  AlertTriangle,
  CheckCircle2,
  Globe2,
  Landmark,
  Loader2,
  Save,
} from 'lucide-react';

import toast from 'react-hot-toast';

import {
  getPlanConfig,
  updatePlanConfig,
} from '@/services/admin-plan-config.service';

import type {
  BankDetails,
  PlanConfig,
} from '@/types/plan-config';

export default function BankDetailsPanel({
  token,
}: {
  token: string;
}) {
  const [config, setConfig] =
    useState<PlanConfig | null>(null);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState<
    'NGN' | 'USD' | null
  >(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await getPlanConfig(token);
        setConfig(data);
      } catch {
        toast.error(
          'Unable to load bank configuration.',
        );
      } finally {
        setLoading(false);
      }
    })();
  }, [token]);

  function updateBankField(
    currency: 'NGN' | 'USD',
    key: keyof BankDetails,
    value: string,
  ) {
    setConfig((prev) => {
      if (!prev) return prev;

      const field =
        currency === 'NGN'
          ? 'bankDetails'
          : 'bankDetailsUSD';

      return {
        ...prev,
        [field]: {
          ...prev[field],
          [key]: value,
        },
      };
    });
  }

  async function save(currency: 'NGN' | 'USD') {
    if (!config) return;

    try {
      setSaving(currency);

      if (currency === 'NGN') {
        await updatePlanConfig(token, {
          bankDetails: config.bankDetails,
        });
      } else {
        await updatePlanConfig(token, {
          bankDetailsUSD:
            config.bankDetailsUSD,
        });
      }

      toast.success('Bank details updated.');
    } catch {
      toast.error(
        'Failed to update bank details.',
      );
    } finally {
      setSaving(null);
    }
  }

  if (loading) {
    return (
      <div className="rounded-2xl border bg-card/70 p-4">
        <div className="h-5 w-40 animate-pulse rounded bg-muted" />
        <div className="mt-4 h-32 animate-pulse rounded-xl bg-muted" />
      </div>
    );
  }

  if (!config) {
    return (
      <div className="rounded-2xl border bg-card/70 p-4 text-sm text-muted-foreground">
        Bank configuration could not be loaded.
      </div>
    );
  }

  return (
    <div className="rounded-2xl border bg-card/70 p-4 sm:p-5">
      <div className="grid gap-4 lg:grid-cols-2">
        <BankEditor
          title="Nigeria"
          details={config.bankDetails}
          saving={saving === 'NGN'}
          icon={
            <span className="font-bold">₦</span>
          }
          onChange={(key, value) =>
            updateBankField(
              'NGN',
              key,
              value,
            )
          }
          onSave={() => save('NGN')}
        />

        <BankEditor
          title="International"
          details={config.bankDetailsUSD}
          saving={saving === 'USD'}
          icon={<Globe2 className="h-4 w-4" />}
          onChange={(key, value) =>
            updateBankField(
              'USD',
              key,
              value,
            )
          }
          onSave={() => save('USD')}
        />
      </div>
    </div>
  );
}

function BankEditor({
  title,
  icon,
  details,
  saving,
  onChange,
  onSave,
}: {
  title: string;
  icon: React.ReactNode;
  details: BankDetails;
  saving: boolean;
  onChange: (
    key: keyof BankDetails,
    value: string,
  ) => void;
  onSave: () => void;
}) {
  const missingFields = useMemo(
    () =>
      Object.values(details).filter(
        (value) => !value.trim(),
      ).length,
    [details],
  );

  const configured = missingFields === 0;

  return (
    <div className="rounded-xl border bg-background/40 p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
            {icon}
          </div>

          <div>
            <p className="text-sm font-semibold">
              {title}
            </p>

            <p className="text-[11px] text-muted-foreground">
              Bank transfer details
            </p>
          </div>
        </div>

        <div
          className={`
            flex
            items-center
            gap-1
            rounded-full
            border
            px-2
            py-1
            text-[10px]
            ${
              configured
                ? 'border-green-500/20 bg-green-500/10 text-green-600'
                : 'border-orange-500/20 bg-orange-500/10 text-orange-600'
            }
          `}
        >
          {configured ? (
            <CheckCircle2 className="h-3 w-3" />
          ) : (
            <AlertTriangle className="h-3 w-3" />
          )}

          {configured ? 'Ready' : 'Incomplete'}
        </div>
      </div>

      <div className="mt-4 grid gap-3">
        <BankInput
          label="Bank"
          value={details.bankName}
          onChange={(value) =>
            onChange('bankName', value)
          }
        />

        <BankInput
          label="Account Name"
          value={details.accountName}
          onChange={(value) =>
            onChange('accountName', value)
          }
        />

        <BankInput
          label="Account Number"
          value={details.accountNumber}
          onChange={(value) =>
            onChange(
              'accountNumber',
              value,
            )
          }
        />

        <label>
          <span className="mb-1.5 block text-[11px] font-medium text-muted-foreground">
            Instructions
          </span>

          <textarea
            rows={3}
            value={details.instructions}
            onChange={(e) =>
              onChange(
                'instructions',
                e.target.value,
              )
            }
            className="
              w-full
              resize-none
              rounded-lg
              border
              bg-background
              px-3
              py-2.5
              text-xs
              outline-none
              focus:border-primary
              focus:ring-2
              focus:ring-primary/10
            "
          />
        </label>
      </div>

      {!configured && (
        <p className="mt-3 text-[11px] text-orange-600">
          {missingFields} field
          {missingFields === 1 ? '' : 's'} still required.
        </p>
      )}

      <button
        type="button"
        onClick={onSave}
        disabled={saving}
        className="
          mt-4
          inline-flex
          items-center
          gap-2
          rounded-lg
          bg-primary
          px-3
          py-2
          text-xs
          font-semibold
          text-primary-foreground
          transition
          hover:opacity-90
          disabled:opacity-50
        "
      >
        {saving ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : (
          <Save className="h-3.5 w-3.5" />
        )}

        {saving ? 'Saving...' : 'Save'}
      </button>
    </div>
  );
}

function BankInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label>
      <span className="mb-1.5 block text-[11px] font-medium text-muted-foreground">
        {label}
      </span>

      <input
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        className="
          w-full
          rounded-lg
          border
          bg-background
          px-3
          py-2.5
          text-xs
          outline-none
          focus:border-primary
          focus:ring-2
          focus:ring-primary/10
        "
      />
    </label>
  );
}