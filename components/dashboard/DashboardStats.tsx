export default function DashboardStats({
  user,
  subscription,
  payments,
  purchases,
}: any) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

      <div className="p-4 bg-gray-900 rounded-lg">
        <p className="text-gray-400">User</p>
        <p className="text-white font-bold">
          {user?.fullName}
        </p>
      </div>

      <div className="p-4 bg-gray-900 rounded-lg">
        <p className="text-gray-400">Plan</p>
        <p className="text-white font-bold uppercase">
          {subscription?.plan || 'FREE'}
        </p>
      </div>

      <div className="p-4 bg-gray-900 rounded-lg">
        <p className="text-gray-400">Payments</p>
        <p className="text-white font-bold">
          {payments?.length || 0}
        </p>
      </div>

      <div className="p-4 bg-gray-900 rounded-lg">
        <p className="text-gray-400">Purchases</p>
        <p className="text-white font-bold">
          {purchases?.length || 0}
        </p>
      </div>

    </div>
  );
}