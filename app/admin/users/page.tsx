'use client';

import { useState } from 'react';
import { useAdminUsers } from '@/hooks/useAdminUsers';
import UsersTable from '@/components/admin/users/UsersTable';

export default function UsersPage() {
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    role: 'all',
  });

  const [page, setPage] = useState(1);

  const { users, loading, totalPages } =
    useAdminUsers(filters, page);

  return (
    <div className="p-6 space-y-4">

      <h1 className="text-3xl font-bold">
        Users
      </h1>

      {/* FILTERS (INLINE — NO NEW FILES REQUIRED) */}
      <div className="flex gap-3">
        <input
          placeholder="Search users..."
          className="p-2 bg-slate-900 border rounded"
          onChange={(e) =>
            setFilters((f) => ({
              ...f,
              search: e.target.value,
            }))
          }
        />

        <select
          onChange={(e) =>
            setFilters((f) => ({
              ...f,
              status: e.target.value,
            }))
          }
        >
          <option value="all">All</option>
          <option value="active">Active</option>
          <option value="suspended">Suspended</option>
          <option value="deleted">Deleted</option>
        </select>
      </div>

      <UsersTable users={users} loading={loading} />

      <div className="flex justify-between mt-4">
        <button onClick={() => setPage(p => p - 1)}>
          Prev
        </button>

        <span>
          Page {page} / {totalPages}
        </span>

        <button onClick={() => setPage(p => p + 1)}>
          Next
        </button>
      </div>

    </div>
  );
}