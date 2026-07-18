'use client';

import { useRouter } from 'next/navigation';
import {
  ShieldCheck,
  Crown,
  UserRound,
  AlertTriangle,
} from 'lucide-react';


export default function UsersTable({
  users,
  loading,
}: any) {

  const router = useRouter();



  if (loading) {

    return (
      <div className="
        space-y-3
        p-6
      ">
        {
          Array.from({
            length:5
          }).map((_,i)=>(
            <div
              key={i}
              className="
                h-14
                animate-pulse
                rounded-xl
                bg-muted
              "
            />
          ))
        }
      </div>
    );

  }



  if (!users?.length) {

    return (
      <div className="
        flex
        min-h-[300px]
        flex-col
        items-center
        justify-center
        gap-3
        text-center
      ">

        <UserRound
          size={40}
          className="
            text-muted-foreground
          "
        />

        <h3 className="
          font-semibold
        ">
          No users found
        </h3>

        <p className="
          text-sm
          text-muted-foreground
        ">
          Try adjusting your filters.
        </p>

      </div>
    );

  }





  return (

    <div className="
      overflow-x-auto
    ">

      <table className="
        w-full
        text-left
      ">


        <thead>

          <tr className="
            border-b
            border-border
            text-xs
            uppercase
            text-muted-foreground
          ">

            <th className="
              p-5
            ">
              User
            </th>


            <th>
              Attention
            </th>


            <th>
              Status
            </th>


            <th>
              Role
            </th>


          </tr>

        </thead>





        <tbody>

        {
          users.map((u:any)=>(


            <tr

              key={u._id}

              onClick={() =>
                router.push(
                  `/admin/users/${u._id}`
                )
              }


              className="
                group
                cursor-pointer
                border-b
                border-border/50
                transition
                hover:bg-muted/40
              "

            >



              {/* USER */}

              <td className="
                p-5
              ">

                <div className="
                  flex
                  items-center
                  gap-3
                ">


                  <div className="
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-full
                    bg-primary/10
                    text-primary
                  ">

                    <UserRound size={18}/>

                  </div>



                  <div>

                    <p className="
                      font-medium
                    ">
                      {u.fullName}
                    </p>


                    <p className="
                      text-sm
                      text-muted-foreground
                    ">
                      {u.email}
                    </p>


                  </div>


                </div>


              </td>







              {/* ATTENTION */}

              <td>

                {
                  u.attention?.required ? (

                    <div className="
                      inline-flex
                      items-center
                      gap-2
                      rounded-full
                      border
                      border-red-500/30
                      bg-red-500/10
                      px-3
                      py-1
                      text-xs
                      text-red-500
                    ">

                      <span className="
                        h-2
                        w-2
                        animate-pulse
                        rounded-full
                        bg-red-500
                      "/>


                      {u.attention.count}
                      issue
                      {
                        u.attention.count > 1
                        ? 's'
                        : ''
                      }


                    </div>


                  ) : (

                    <div className="
                      inline-flex
                      items-center
                      gap-2
                      text-xs
                      text-muted-foreground
                    ">

                      <span className="
                        h-2
                        w-2
                        rounded-full
                        bg-green-500
                      "/>

                      Healthy

                    </div>

                  )
                }


              </td>







              {/* STATUS */}

              <td>

                <span
                  className={`
                    rounded-full
                    px-3
                    py-1
                    text-xs
                    capitalize

                    ${
                      u.status === 'active'
                      ?
                      'bg-green-500/10 text-green-500'
                      :
                      u.status === 'suspended'
                      ?
                      'bg-yellow-500/10 text-yellow-500'
                      :
                      'bg-red-500/10 text-red-500'
                    }
                  `}
                >

                  {u.status}

                </span>


              </td>







              {/* ROLE */}

              <td>


                {
                  u.role === 'admin'
                  ?

                  <span className="
                    inline-flex
                    items-center
                    gap-2
                    text-sm
                  ">

                    <ShieldCheck
                      size={16}
                      className="text-primary"
                    />

                    Admin

                  </span>


                  :

                  u.isVip

                  ?

                  <span className="
                    inline-flex
                    items-center
                    gap-2
                    text-sm
                  ">

                    <Crown
                      size={16}
                      className="text-yellow-500"
                    />

                    VIP

                  </span>


                  :

                  <span className="
                    text-sm
                    text-muted-foreground
                  ">
                    User
                  </span>

                }


              </td>



            </tr>


          ))
        }


        </tbody>



      </table>


    </div>

  );

}