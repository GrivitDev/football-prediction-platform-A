export default function LoadingState() {
  return (
    <div className="space-y-3 animate-pulse">
      <div className="h-24 rounded-lg border border-border bg-card" />

      <div className="h-28 rounded-lg border border-border bg-card" />

      <div className="grid gap-3 xl:grid-cols-2">
        <div className="h-40 rounded-lg border border-border bg-card" />
        <div className="h-40 rounded-lg border border-border bg-card" />
      </div>

      <div className="h-48 rounded-lg border border-border bg-card" />
    </div>
  );
}