'use client';

import {
  Monitor,
  ShieldCheck,
  ShieldAlert,
  Clock,
  Globe,
} from 'lucide-react';


type Props = {
  sessions:any[];
};





export default function SessionHistoryTable({
  sessions,
}:Props){


  return (

    <section className="
      overflow-hidden
      rounded-3xl
      border
      bg-card/60
      shadow-xl
      backdrop-blur-xl
    ">


      {/* HEADER */}

      <div className="
        flex
        items-center
        gap-3
        border-b
        border-border
        px-6
        py-5
      ">


        <div className="
          flex
          h-10
          w-10
          items-center
          justify-center
          rounded-xl
          bg-blue-500/10
          text-blue-500
        ">

          <ShieldCheck size={20}/>

        </div>



        <div>

          <h2 className="
            font-semibold
          ">
            Login Sessions
          </h2>


          <p className="
            text-xs
            text-muted-foreground
          ">
            Device activity and security history
          </p>


        </div>


      </div>








      {
        sessions.length === 0

        ?

        (

          <div className="
            flex
            min-h-[220px]
            flex-col
            items-center
            justify-center
            gap-3
            text-center
          ">


            <ShieldAlert
              size={38}
              className="
                text-muted-foreground
              "
            />


            <p className="
              font-medium
            ">
              No sessions found
            </p>


            <p className="
              text-sm
              text-muted-foreground
            ">
              No login activity recorded.
            </p>


          </div>

        )


        :

        (

          <div className="
            overflow-x-auto
          ">


            <table className="
              w-full
              text-sm
            ">



              <thead>

                <tr className="
                  border-b
                  border-border
                  text-left
                  text-xs
                  uppercase
                  text-muted-foreground
                ">


                  <th className="
                    px-6
                    py-4
                  ">
                    Device
                  </th>



                  <th>
                    IP Address
                  </th>



                  <th>
                    Last Active
                  </th>



                  <th>
                    Status
                  </th>


                </tr>


              </thead>







              <tbody>


                {
                  sessions.map((session)=>(


                    <tr

                      key={session._id}

                      className="
                        border-b
                        border-border/50
                        transition
                        hover:bg-muted/40
                      "

                    >





                      {/* DEVICE */}

                      <td className="
                        px-6
                        py-4
                      ">


                        <div className="
                          flex
                          items-center
                          gap-3
                        ">


                          <div className="
                            flex
                            h-9
                            w-9
                            items-center
                            justify-center
                            rounded-xl
                            bg-blue-500/10
                            text-blue-500
                          ">

                            <Monitor size={16}/>

                          </div>



                          <span className="
                            font-medium
                          ">

                            {
                              session.device
                              ||
                              'Unknown Device'
                            }

                          </span>


                        </div>


                      </td>








                      {/* IP */}

                      <td>


                        <div className="
                          inline-flex
                          items-center
                          gap-2
                          rounded-lg
                          bg-muted
                          px-3
                          py-1
                          font-mono
                          text-xs
                        ">


                          <Globe size={13}/>


                          {
                            session.ipAddress
                            ||
                            'Unknown'
                          }


                        </div>


                      </td>








                      {/* LAST ACTIVE */}

                      <td>


                        <div className="
                          flex
                          items-center
                          gap-2
                          text-muted-foreground
                        ">

                          <Clock size={14}/>


                          {
                            new Date(
                              session.lastActiveAt
                            ).toLocaleString()
                          }


                        </div>


                      </td>








                      {/* STATUS */}

                      <td>

                        {
                          session.isActive

                          ?

                          (

                            <span className="
                              inline-flex
                              items-center
                              gap-2
                              rounded-full
                              border
                              border-green-500/20
                              bg-green-500/10
                              px-3
                              py-1
                              text-xs
                              text-green-500
                            ">

                              <span className="
                                h-2
                                w-2
                                rounded-full
                                bg-green-500
                              "/>


                              Active


                            </span>

                          )


                          :

                          (

                            <span className="
                              inline-flex
                              items-center
                              gap-2
                              rounded-full
                              border
                              border-red-500/20
                              bg-red-500/10
                              px-3
                              py-1
                              text-xs
                              text-red-500
                            ">


                              <span className="
                                h-2
                                w-2
                                rounded-full
                                bg-red-500
                              "/>


                              Revoked


                            </span>

                          )
                        }


                      </td>




                    </tr>


                  ))
                }


              </tbody>



            </table>


          </div>

        )
      }



    </section>

  );

}