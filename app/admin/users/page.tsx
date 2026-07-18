'use client';

import { useMemo, useState } from 'react';
import {
  Search,
  Users,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

import { motion } from 'framer-motion';

import { useAdminUsers } from '@/hooks/useAdminUsers';

import UsersTable from '@/components/admin/users/UsersTable';


export default function UsersPage() {

  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    role: 'all',
  });


  const [page, setPage] = useState(1);


  const {
    users,
    loading,
    totalPages,
  } = useAdminUsers(
    filters,
    page
  );



  const attentionCount = useMemo(() => {

    return users.filter(
      (user: { attention?: { required?: boolean } }) =>
        user.attention?.required
    ).length;

  }, [users]);




  return (

    <main className="
      space-y-8
      p-6
      md:p-8
    ">


      {/* HEADER */}

      <motion.section
        initial={{
          opacity:0,
          y:20
        }}
        animate={{
          opacity:1,
          y:0
        }}
        className="
          relative
          overflow-hidden
          rounded-3xl
          border
          bg-card/60
          p-6
          shadow-xl
          backdrop-blur-xl
        "
      >

        <div className="
          absolute
          inset-0
          bg-gradient-to-br
          from-primary/10
          via-transparent
          to-transparent
        "/>


        <div className="
          relative
          flex
          flex-col
          gap-4
          md:flex-row
          md:items-center
          md:justify-between
        ">


          <div>

            <div className="
              flex
              items-center
              gap-3
            ">

              <Users
                className="text-primary"
              />

              <h1 className="
                text-3xl
                font-bold
              ">
                Users
              </h1>

            </div>


            <p className="
              mt-2
              text-sm
              text-muted-foreground
            ">
              Manage accounts, subscriptions,
              payments and user activity.
            </p>

          </div>




          {
            attentionCount > 0 && (

              <div className="
                flex
                items-center
                gap-3
                rounded-full
                border
                border-red-500/30
                bg-red-500/10
                px-4
                py-2
                text-sm
                text-red-500
              ">

                <AlertTriangle
                  size={18}
                />

                {attentionCount}
                users need attention

              </div>

            )
          }


        </div>

      </motion.section>






      {/* FILTER BAR */}

      <motion.section
        initial={{
          opacity:0
        }}
        animate={{
          opacity:1
        }}
        transition={{
          delay:.1
        }}
        className="
          flex
          flex-col
          gap-4
          rounded-2xl
          border
          bg-card/50
          p-4
          backdrop-blur-xl
          md:flex-row
        "
      >


        {/* SEARCH */}

        <div className="
          relative
          flex-1
        ">

          <Search
            size={18}
            className="
              absolute
              left-3
              top-1/2
              -translate-y-1/2
              text-muted-foreground
            "
          />


          <input

            placeholder="Search users..."

            value={filters.search}

            onChange={(e)=>
              setFilters(f=>({
                ...f,
                search:e.target.value
              }))
            }

            className="
              h-11
              w-full
              rounded-xl
              border
              bg-background
              pl-10
              pr-4
              text-sm
              outline-none
              transition
              focus:border-primary
            "
          />

        </div>





        {/* STATUS */}

        <select

          value={filters.status}

          onChange={(e)=>
            setFilters(f=>({
              ...f,
              status:e.target.value
            }))
          }

          className="
            h-11
            rounded-xl
            border
            bg-background
            px-4
            text-sm
            outline-none
            focus:border-primary
          "
        >

          <option value="all">
            All Status
          </option>

          <option value="active">
            Active
          </option>

          <option value="suspended">
            Suspended
          </option>

          <option value="deleted">
            Deleted
          </option>

        </select>






        {/* ROLE */}

        <select

          value={filters.role}

          onChange={(e)=>
            setFilters(f=>({
              ...f,
              role:e.target.value
            }))
          }

          className="
            h-11
            rounded-xl
            border
            bg-background
            px-4
            text-sm
            outline-none
            focus:border-primary
          "
        >

          <option value="all">
            All Roles
          </option>


          <option value="user">
            User
          </option>


          <option value="admin">
            Admin
          </option>

        </select>


      </motion.section>







      {/* TABLE */}

      <motion.section

        initial={{
          opacity:0,
          y:20
        }}

        animate={{
          opacity:1,
          y:0
        }}

        transition={{
          delay:.2
        }}

        className="
          overflow-hidden
          rounded-3xl
          border
          bg-card/60
          shadow-xl
          backdrop-blur-xl
        "

      >

        <UsersTable
          users={users}
          loading={loading}
        />


      </motion.section>







      {/* PAGINATION */}

      <div className="
        flex
        items-center
        justify-between
        rounded-2xl
        border
        bg-card/50
        px-5
        py-3
      ">


        <button

          disabled={page <= 1}

          onClick={() =>
            setPage(
              p => Math.max(
                1,
                p - 1
              )
            )
          }

          className="
            inline-flex
            items-center
            gap-2
            rounded-xl
            border
            px-4
            py-2
            text-sm
            disabled:opacity-40
          "
        >

          <ChevronLeft size={16}/>

          Previous

        </button>




        <span className="
          text-sm
          text-muted-foreground
        ">

          Page {page} of {totalPages}

        </span>




        <button

          disabled={page >= totalPages}

          onClick={() =>
            setPage(
              p => Math.min(
                totalPages,
                p + 1
              )
            )
          }

          className="
            inline-flex
            items-center
            gap-2
            rounded-xl
            border
            px-4
            py-2
            text-sm
            disabled:opacity-40
          "
        >

          Next

          <ChevronRight size={16}/>

        </button>


      </div>



    </main>

  );
}