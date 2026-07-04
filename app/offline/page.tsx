export default function OfflinePage() {
  return (
    <main className="bg-slate-950 min-h-screen flex items-center justify-center text-white p-10">
      <div className="max-w-2xl text-center">
        <h1 className="text-6xl font-black">
          You Are Offline
        </h1>

        <p className="mt-8 text-2xl text-slate-400">
          Please reconnect to the internet
          to continue using Sure Predict
          Pro.
        </p>
      </div>
    </main>
  );
}