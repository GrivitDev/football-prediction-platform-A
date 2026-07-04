export default function CurrentPlanCard({ subscription }: any) {
  const plan = subscription?.plan || 'free';

  return (
    <div className="p-6 bg-gray-900 rounded-xl">
      <h2 className="text-lg font-bold text-white">
        Current Plan
      </h2>

      <p className="text-gray-400 mt-2">
        You are currently on:
      </p>

      <p className="text-2xl font-bold text-green-400 mt-1 uppercase">
        {plan}
      </p>

      {plan === 'free' && (
        <p className="text-sm text-yellow-400 mt-2">
          Upgrade to unlock predictions early
        </p>
      )}
    </div>
  );
}