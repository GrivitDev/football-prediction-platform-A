'use client';

import {
  CheckCircle,
  Clock,
  XCircle,
  CreditCard,
} from 'lucide-react';


type Props = {
  payments:any[];
};



const money = (amount:number)=>
  new Intl.NumberFormat('en-NG',{
    style:'currency',
    currency:'NGN',
    maximumFractionDigits:0,
  }).format(amount);






export default function PaymentHistoryTable({
  payments,
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
          bg-primary/10
          text-primary
        ">

          <CreditCard size={20}/>

        </div>



        <div>

          <h2 className="
            font-semibold
          ">
            Payment History
          </h2>


          <p className="
            text-xs
            text-muted-foreground
          ">
            User financial transactions
          </p>


        </div>


      </div>







      {
        payments.length === 0

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


            <CreditCard
              size={36}
              className="
                text-muted-foreground
              "
            />


            <p className="
              font-medium
            ">
              No payment history
            </p>


            <p className="
              text-sm
              text-muted-foreground
            ">
              This user has not made any payments yet.
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
                    Date
                  </th>


                  <th>
                    Type
                  </th>


                  <th>
                    Amount
                  </th>


                  <th>
                    Status
                  </th>


                  <th>
                    Reference
                  </th>


                </tr>


              </thead>






              <tbody>


                {
                  payments.map((payment)=>(


                    <tr

                      key={payment._id}

                      className="
                        border-b
                        border-border/50
                        transition
                        hover:bg-muted/40
                      "

                    >



                      {/* DATE */}

                      <td className="
                        px-6
                        py-4
                      ">

                        <p className="
                          font-medium
                        ">

                          {
                            new Date(
                              payment.createdAt
                            ).toLocaleDateString()
                          }

                        </p>

                      </td>






                      {/* TYPE */}

                      <td>

                        <span className="
                          rounded-full
                          bg-primary/10
                          px-3
                          py-1
                          text-xs
                          capitalize
                          text-primary
                        ">

                          {
                            payment.type
                              .replace('_',' ')
                          }

                        </span>

                      </td>







                      {/* AMOUNT */}

                      <td className="
                        font-semibold
                      ">

                        {
                          money(
                            payment.amount
                          )
                        }

                      </td>







                      {/* STATUS */}

                      <td>

                        <PaymentStatus
                          status={
                            payment.status
                          }
                        />

                      </td>







                      {/* REFERENCE */}

                      <td>

                        <span className="
                          rounded-lg
                          bg-muted
                          px-2
                          py-1
                          font-mono
                          text-xs
                        ">

                          {
                            payment.reference
                          }

                        </span>


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








function PaymentStatus({
  status,
}:{
  status:string;
}){


  const config = {

    approved:{
      icon:<CheckCircle size={14}/>,
      className:
        'text-green-500 bg-green-500/10 border-green-500/20',
    },


    pending:{
      icon:<Clock size={14}/>,
      className:
        'text-yellow-500 bg-yellow-500/10 border-yellow-500/20',
    },


    rejected:{
      icon:<XCircle size={14}/>,
      className:
        'text-red-500 bg-red-500/10 border-red-500/20',
    },

  }[status] ?? {

    icon:null,

    className:
      'text-muted-foreground bg-muted',

  };



  return (

    <span className={`
      inline-flex
      items-center
      gap-2
      rounded-full
      border
      px-3
      py-1
      text-xs
      capitalize
      ${config.className}
    `}>

      {config.icon}

      {status}

    </span>

  );

}