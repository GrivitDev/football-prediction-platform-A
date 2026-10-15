'use client';

import { useEffect, useMemo, useState } from 'react';

import {
  AlertTriangle,
  CheckCircle2,
  Clock3,
  Globe2,
  Loader2,
  Save,
  Tag,
} from 'lucide-react';

import toast from 'react-hot-toast';

import {
  getPlanConfig,
  updatePlanConfig,
} from '@/services/admin-plan-config.service';

import type { PlanConfig } from '@/types/plan-config';

export default function PlanConfigPanel({
  token,
}: {
  token: string;
}) {
  const [config, setConfig] =
    useState<PlanConfig | null>(null);

  const [originalConfig, setOriginalConfig] =
    useState<PlanConfig | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const data = await getPlanConfig(token);

        setConfig(data);
        setOriginalConfig(data);
      } catch {
        toast.error(
          'Unable to load subscription configuration',
        );
      } finally {
        setLoading(false);
      }
    })();
  }, [token]);

  const updateField = (
    key: keyof PlanConfig,
    value: number,
  ) => {
    setConfig((prev) =>
      prev
        ? {
            ...prev,
            [key]: value,
          }
        : prev,
    );
  };

  const updateLabel = (
    key: keyof PlanConfig['planLabels'],
    value: string,
  ) => {
    setConfig((prev) =>
      prev
        ? {
            ...prev,
            planLabels: {
              ...prev.planLabels,
              [key]: value,
            },
          }
        : prev,
    );
  };

  const hasChanges = useMemo(
    () =>
      JSON.stringify(config) !==
      JSON.stringify(originalConfig),
    [config, originalConfig],
  );

  const incomplete = useMemo(() => {
    if (!config) return true;

    return (
      config.regularPrice <= 0 ||
      config.vipPrice <= 0 ||
      config.premiumPrice <= 0 ||
      config.regularPriceUSD <= 0 ||
      config.vipPriceUSD <= 0 ||
      config.premiumPriceUSD <= 0 ||
      config.subscriptionDurationDays < 1 ||
      config.premiumDurationDays < 0 ||
      !config.planLabels.free.trim() ||
      !config.planLabels.regular.trim() ||
      !config.planLabels.vip.trim() ||
      !config.planLabels.premium.trim()
    );
  }, [config]);

  async function save() {
    if (!config) return;

    if (incomplete) {
      toast.error(
        'Please complete all configuration fields.',
      );
      return;
    }

    try {
      setSaving(true);

      const updated =
        await updatePlanConfig(token, config);

      setConfig(updated);
      setOriginalConfig(updated);

      toast.success(
        'Subscription configuration updated.',
      );
    } catch {
      toast.error(
        'Failed to update configuration.',
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="rounded-2xl border bg-card/70 p-4">
        <div className="h-5 w-40 animate-pulse rounded bg-muted" />
        <div className="mt-4 h-40 animate-pulse rounded-xl bg-muted" />
      </div>
    );
  }

  if (!config) {
    return (
      <div className="rounded-2xl border bg-card/70 p-4 text-sm text-muted-foreground">
        Subscription configuration could not be loaded.
      </div>
    );
  }

  return (
    <div className="rounded-2xl border bg-card/70 p-4 sm:p-5">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div className="text-sm font-semibold">
          Pricing
        </div>

        <div
          className={`
            flex
            items-center
            gap-1.5
            rounded-full
            border
            px-2.5
            py-1
            text-[11px]
            ${
              hasChanges
                ? 'border-orange-500/20 bg-orange-500/10 text-orange-600'
                : 'border-green-500/20 bg-green-500/10 text-green-600'
            }
          `}
        >
          {hasChanges ? (
            <>
              <AlertTriangle className="h-3 w-3" />
              Unsaved
            </>
          ) : (
            <>
              <CheckCircle2 className="h-3 w-3" />
              Synced
            </>
          )}
        </div>
      </div>

      <div className="space-y-7">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold">
            <span>₦</span>
            Nigeria
          </div>

          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            <PriceInput
              label="Regular"
              value={config.regularPrice}
              onChange={(value) =>
                updateField(
                  'regularPrice',
                  value,
                )
              }
            />

            <PriceInput
              label="VIP"
              value={config.vipPrice}
              onChange={(value) =>
                updateField('vipPrice', value)
              }
            />

            <PriceInput
              label="Premium"
              value={config.premiumPrice}
              onChange={(value) =>
                updateField(
                  'premiumPrice',
                  value,
                )
              }
            />
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 text-xs font-semibold">
            <Globe2 className="h-3.5 w-3.5" />
            International
          </div>

          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            <PriceInput
              label="Regular USD"
              value={config.regularPriceUSD}
              onChange={(value) =>
                updateField(
                  'regularPriceUSD',
                  value,
                )
              }
            />

            <PriceInput
              label="VIP USD"
              value={config.vipPriceUSD}
              onChange={(value) =>
                updateField(
                  'vipPriceUSD',
                  value,
                )
              }
            />

            <PriceInput
              label="Premium USD"
              value={config.premiumPriceUSD}
              onChange={(value) =>
                updateField(
                  'premiumPriceUSD',
                  value,
                )
              }
            />
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 text-xs font-semibold">
            <Clock3 className="h-3.5 w-3.5" />
            Duration
          </div>

          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <PriceInput
              label="Regular / VIP Days"
              value={config.subscriptionDurationDays}
              onChange={(value) =>
                updateField(
                  'subscriptionDurationDays',
                  value,
                )
              }
            />

            <PriceInput
              label="Premium Days (0 = Lifetime)"
              value={config.premiumDurationDays}
              onChange={(value) =>
                updateField(
                  'premiumDurationDays',
                  value,
                )
              }
            />
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 text-xs font-semibold">
            <Tag className="h-3.5 w-3.5" />
            Plan Labels
          </div>

          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <TextInput
              label="Free"
              value={config.planLabels.free}
              onChange={(value) =>
                updateLabel('free', value)
              }
            />

            <TextInput
              label="Regular"
              value={config.planLabels.regular}
              onChange={(value) =>
                updateLabel('regular', value)
              }
            />

            <TextInput
              label="VIP"
              value={config.planLabels.vip}
              onChange={(value) =>
                updateLabel('vip', value)
              }
            />

            <TextInput
              label="Premium"
              value={config.planLabels.premium}
              onChange={(value) =>
                updateLabel('premium', value)
              }
            />
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={save}
        disabled={saving || !hasChanges}
        className="
          mt-6
          inline-flex
          items-center
          gap-2
          rounded-lg
          bg-primary
          px-4
          py-2.5
          text-xs
          font-semibold
          text-primary-foreground
          transition
          hover:opacity-90
          disabled:cursor-not-allowed
          disabled:opacity-50
        "
      >
        {saving ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : (
          <Save className="h-3.5 w-3.5" />
        )}

        {saving ? 'Saving...' : 'Save Changes'}
      </button>
    </div>
  );
}

function PriceInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] font-medium text-muted-foreground">
        {label}
      </span>

      <input
        type="number"
        min="0"
        value={value ?? ''}
        onChange={(e) =>
          onChange(Number(e.target.value))
        }
        className="
          w-full
          rounded-lg
          border
          bg-background
          px-3
          py-2.5
          text-sm
          outline-none
          focus:border-primary
          focus:ring-2
          focus:ring-primary/10
        "
      />
    </label>
  );
}

function TextInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] font-medium text-muted-foreground">
        {label}
      </span>

      <input
        type="text"
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
          text-sm
          outline-none
          focus:border-primary
          focus:ring-2
          focus:ring-primary/10
        "
      />
    </label>
  );
}