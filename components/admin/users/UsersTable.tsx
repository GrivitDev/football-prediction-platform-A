'use client';

import { useRouter } from 'next/navigation';

export default function UsersTable({
  users,
  loading,
}: any) {
  const router = useRouter();

  if (loading) {
    return <p className="text-gray-400">Loading users...</p>;
  }

  return (
    <div className="bg-slate-900 rounded-xl overflow-hidden">
      <table className="w-full text-left">
        <thead>
          <tr className="text-gray-400 border-b border-slate-800">
            <th className="p-3">Name</th>
            <th>Email</th>
            <th>Status</th>
            <th>Role</th>
          </tr>
        </thead>

        <tbody>
          {users.map((u: any) => (
            <tr
              key={u._id}
              onClick={() => router.push(`/admin/users/${u._id}`)}
              className="cursor-pointer hover:bg-slate-800"
            >
              <td className="p-3">{u.fullName}</td>
              <td>{u.email}</td>
              <td>{u.status}</td>
              <td>{u.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}