'use client';

type Props = {
  sessions: any[];
};

export default function SessionHistoryTable({
  sessions,
}: Props) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">

      <div className="px-6 py-4 border-b border-slate-800">
        <h2 className="text-lg font-semibold">
          Login Sessions
        </h2>
      </div>

      {sessions.length === 0 ? (
        <div className="p-6 text-gray-400">
          No sessions.
        </div>
      ) : (
        <table className="w-full">

          <thead className="bg-slate-950 text-gray-400">
            <tr>
              <th className="text-left px-6 py-3">
                Device
              </th>

              <th className="text-left">
                IP Address
              </th>

              <th className="text-left">
                Last Active
              </th>

              <th className="text-left">
                Status
              </th>
            </tr>
          </thead>

          <tbody>

            {sessions.map((session) => (
              <tr
                key={session._id}
                className="border-t border-slate-800"
              >
                <td className="px-6 py-4">
                  {session.device || 'Unknown'}
                </td>

                <td>
                  {session.ipAddress}
                </td>

                <td>
                  {new Date(
                    session.lastActiveAt,
                  ).toLocaleString()}
                </td>

                <td>
                  <span
                    className={
                      session.isActive
                        ? 'text-green-400'
                        : 'text-red-400'
                    }
                  >
                    {session.isActive
                      ? 'Active'
                      : 'Revoked'}
                  </span>
                </td>
              </tr>
            ))}

          </tbody>

        </table>
      )}
    </div>
  );
}