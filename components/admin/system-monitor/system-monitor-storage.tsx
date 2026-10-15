'use client';

import {
  Activity,
  Boxes,
  Database,
  FileStack,
  HardDrive,
  RefreshCw,
} from 'lucide-react';

import {
  useMemo,
} from 'react';

import {
  useSystemMonitorStorage,
} from '@/hooks/use-system-monitor';


// ============================================================
// HELPERS
// ============================================================

const formatBytes = (
  bytes: number,
  decimals = 2,
): string => {
  if (
    !Number.isFinite(bytes) ||
    bytes < 0
  ) {
    return '—';
  }

  if (bytes === 0) {
    return '0 B';
  }

  const units = [
    'B',
    'KB',
    'MB',
    'GB',
    'TB',
  ];

  const unitIndex = Math.min(
    Math.floor(
      Math.log(bytes) /
        Math.log(1024),
    ),
    units.length - 1,
  );

  const value =
    bytes /
    Math.pow(
      1024,
      unitIndex,
    );

  return `${value.toFixed(
    unitIndex === 0
      ? 0
      : decimals,
  )} ${units[unitIndex]}`;
};


const formatNumber = (
  value: number,
): string => {
  return new Intl.NumberFormat(
    'en-US',
  ).format(value);
};


const formatDateTime = (
  value?: string,
): string => {
  if (!value) {
    return '—';
  }

  const date = new Date(value);

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return '—';
  }

  return date.toLocaleString(
    'en-GB',
    {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    },
  );
};


// ============================================================
// COMPONENT
// ============================================================

export default function SystemMonitorStorage() {
  const storageQuery =
    useSystemMonitorStorage();

  const storage =
    storageQuery.data;

  const collections = useMemo(
    () =>
      [...(
        storage?.collections ?? []
      )].sort(
        (
          a,
          b,
        ) =>
          b.totalSizeBytes -
          a.totalSizeBytes,
      ),
    [storage?.collections],
  );

  const totals =
    storage?.totals;


  return (
    <div className="space-y-3">
      {/* ======================================================
          HEADER
      ====================================================== */}

      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-lg font-bold text-foreground">
            Database Storage
          </h2>

          <p className="text-xs text-muted-foreground">
            Live MongoDB storage, document, and index statistics.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {storage?.persistedAt && (
            <span className="text-[10px] text-muted-foreground">
              Snapshot {formatDateTime(
                storage.persistedAt,
              )}
            </span>
          )}

          <RefreshCw
            className={`h-4 w-4 text-muted-foreground ${
              storageQuery.isFetching
                ? 'animate-spin'
                : ''
            }`}
          />
        </div>
      </div>


      {/* ======================================================
          DATABASE SUMMARY
      ====================================================== */}

      <div className="grid grid-cols-2 gap-2 md:grid-cols-3 xl:grid-cols-6">
        <StorageMetric
          label="Total Storage"
          value={
            formatBytes(
              totals?.totalSizeBytes ?? 0,
            )
          }
          icon={Database}
          emphasis
        />

        <StorageMetric
          label="Data Size"
          value={
            formatBytes(
              totals?.dataSizeBytes ?? 0,
            )
          }
          icon={FileStack}
        />

        <StorageMetric
          label="Storage Allocated"
          value={
            formatBytes(
              totals?.storageSizeBytes ?? 0,
            )
          }
          icon={HardDrive}
        />

        <StorageMetric
          label="Indexes"
          value={
            formatBytes(
              totals?.indexSizeBytes ?? 0,
            )
          }
          icon={Activity}
        />

        <StorageMetric
          label="Documents"
          value={formatNumber(
            totals?.documents ?? 0,
          )}
          icon={Boxes}
        />

        <StorageMetric
          label="Collections"
          value={formatNumber(
            totals?.collections ?? 0,
          )}
          icon={Database}
        />
      </div>


      {/* ======================================================
          COLLECTIONS
      ====================================================== */}

      <section className="overflow-hidden rounded-xl border border-border bg-card/60">
        <div className="border-b border-border px-3 py-2.5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-semibold text-foreground">
                Collections
              </h3>

              <p className="text-[10px] text-muted-foreground">
                Sorted by total footprint, including indexes.
              </p>
            </div>

            <span className="rounded-full bg-muted px-2 py-0.5 text-[9px] font-semibold text-muted-foreground">
              {collections.length} COLLECTIONS
            </span>
          </div>
        </div>

        <div className="grid gap-2 p-2 md:grid-cols-2 xl:grid-cols-3">
          {collections.map(
            collection => (
              <CollectionCard
                key={collection.name}
                collection={collection}
              />
            ),
          )}

          {collections.length === 0 && (
            <div className="col-span-full rounded-xl border border-dashed border-border p-8 text-center text-xs text-muted-foreground">
              No MongoDB collection statistics are available.
            </div>
          )}
        </div>
      </section>


      {/* ======================================================
          DATABASE INFO
      ====================================================== */}

      {storage && (
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 rounded-lg border border-border bg-background/30 px-3 py-2 text-[9px] text-muted-foreground">
          <span>
            Database:{' '}
            <span className="font-semibold text-foreground">
              {storage.databaseName}
            </span>
          </span>

          <span>
            Captured:{' '}
            <span className="font-semibold text-foreground">
              {formatDateTime(
                storage.capturedAt,
              )}
            </span>
          </span>

          <span>
            Total footprint:{' '}
            <span className="font-semibold text-foreground">
              {formatBytes(
                totals?.totalSizeBytes ?? 0,
              )}
            </span>
          </span>
        </div>
      )}
    </div>
  );
}


// ============================================================
// STORAGE METRIC
// ============================================================

function StorageMetric({
  label,
  value,
  icon: Icon,
  emphasis = false,
}: {
  label: string;
  value: string;
  icon: typeof Database;
  emphasis?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border border-border bg-card/60 px-3 py-2 ${
        emphasis
          ? 'ring-1 ring-primary/10'
          : ''
      }`}
    >
      <div className="flex items-center gap-1.5 text-muted-foreground">
        <Icon className="h-3.5 w-3.5" />

        <span className="text-[9px]">
          {label}
        </span>
      </div>

      <p
        className={`mt-1 ${
          emphasis
            ? 'text-base'
            : 'text-sm'
        } font-bold text-foreground`}
      >
        {value}
      </p>
    </div>
  );
}


// ============================================================
// COLLECTION CARD
// ============================================================

function CollectionCard({
  collection,
}: {
  collection: {
    name: string;
    documents: number;
    dataSizeBytes: number;
    storageSizeBytes: number;
    averageDocumentSizeBytes: number;
    indexes: number;
    totalIndexSizeBytes: number;
    totalSizeBytes: number;
  };
}) {
  return (
    <article className="rounded-xl border border-border bg-background/30 p-3">
      {/* HEADER */}

      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h4
            className="truncate text-xs font-bold text-foreground"
            title={collection.name}
          >
            {collection.name}
          </h4>

          <p className="mt-0.5 text-[9px] text-muted-foreground">
            {formatNumber(
              collection.documents,
            )}{' '}
            documents
          </p>
        </div>

        <span className="shrink-0 rounded-full bg-primary/10 px-2 py-0.5 text-[9px] font-semibold text-primary">
          {formatBytes(
            collection.totalSizeBytes,
          )}
        </span>
      </div>


      {/* DETAILS */}

      <div className="mt-2 grid grid-cols-2 gap-1.5">
        <CollectionStat
          label="Storage"
          value={formatBytes(
            collection.storageSizeBytes,
          )}
        />

        <CollectionStat
          label="Data"
          value={formatBytes(
            collection.dataSizeBytes,
          )}
        />

        <CollectionStat
          label="Avg Document"
          value={formatBytes(
            collection.averageDocumentSizeBytes,
          )}
        />

        <CollectionStat
          label="Indexes"
          value={formatNumber(
            collection.indexes,
          )}
        />

        <CollectionStat
          label="Index Size"
          value={formatBytes(
            collection.totalIndexSizeBytes,
          )}
        />

        <CollectionStat
          label="Total"
          value={formatBytes(
            collection.totalSizeBytes,
          )}
        />
      </div>
    </article>
  );
}


// ============================================================
// COLLECTION STAT
// ============================================================

function CollectionStat({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border border-border/70 bg-background/30 px-2 py-1.5">
      <p className="text-[8px] text-muted-foreground">
        {label}
      </p>

      <p className="mt-0.5 truncate text-[10px] font-semibold text-foreground">
        {value}
      </p>
    </div>
  );
}