'use client';


import {
  Lock,
  Crown,
  ShoppingCart,
} from 'lucide-react';



interface LockedCardProps {

  loading:boolean;

  price:number;

  message?:string;


  onUpgrade:()=>void;


  onBuy:()=>void;

}



export default function LockedCard({

  loading,

  price,

  message,

  onUpgrade,

  onBuy,

}:LockedCardProps){


  return (


    <div

      className="
        rounded-3xl
        border
        border-yellow-500/30
        bg-yellow-500/10
        p-6
        backdrop-blur-xl
      "

    >




      <div

        className="
          flex
          items-center
          gap-3
        "

      >


        <div

          className="
            rounded-xl
            bg-yellow-500/20
            p-3
          "

        >

          <Lock

            className="
              h-6
              w-6
              text-yellow-500
            "

          />

        </div>



        <div>


          <h3

            className="
              font-semibold
              text-yellow-600
            "

          >

            Prediction Locked

          </h3>



          <p

            className="
              text-sm
              text-muted-foreground
            "

          >

            {message ||
              'Unlock this prediction to view complete analysis'}

          </p>


        </div>



      </div>







      <div

        className="
          mt-6
          rounded-2xl
          border
          bg-background/50
          p-5
        "

      >


        <p

          className="
            font-semibold
          "

        >

          Unlock access:

        </p>




        <ul

          className="
            mt-3
            space-y-2
            text-sm
            text-muted-foreground
          "

        >

          <li>
            ✓ Full prediction
          </li>


          <li>
            ✓ Probability analysis
          </li>


          <li>
            ✓ Betting markets
          </li>


        </ul>



      </div>






      <div

        className="
          mt-6
          grid
          gap-3
          sm:grid-cols-2
        "

      >



        <button


          onClick={onUpgrade}


          className="
            inline-flex
            items-center
            justify-center
            gap-2
            rounded-xl
            border
            px-5
            py-3
            font-semibold
            transition
            hover:bg-muted
          "


        >


          <Crown

            className="
              h-4
              w-4
            "

          />


          Upgrade


        </button>







        <button


          disabled={loading}


          onClick={onBuy}


          className="
            inline-flex
            items-center
            justify-center
            gap-2
            rounded-xl
            bg-yellow-500
            px-5
            py-3
            font-semibold
            text-black
            transition
            hover:bg-yellow-400
            disabled:opacity-50
          "


        >



          <ShoppingCart

            className="
              h-4
              w-4
            "

          />



          {
            loading
              ? 'Processing...'
              : `Buy ₦${price}`
          }



        </button>



      </div>




    </div>


  );

}