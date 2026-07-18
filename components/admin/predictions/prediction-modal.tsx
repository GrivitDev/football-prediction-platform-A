'use client';

import {
  useState,
} from 'react';

import {
  PredictionMarkets,
} from '@/lib/prediction-enums';

import {
  PredictionMarketOptions,
} from '@/lib/prediction-market-config';


interface MarketItem {

  market: string;

  selection: string;

  playerName?: string;

  line?: string;

  customValue?: string;

}


interface PredictionModalProps {
  match: any;
  onClose: () => void;
  onSubmit: (payload: any) => void;
  loading: boolean;
}


// =========================
// CONFIDENCE ENGINE
// =========================

const calculateConfidence = (
  home: number,
  draw: number,
  away: number,
) => {

  const probs =
    [home, draw, away]
      .sort(
        (a, b) => b - a,
      );


  const highest = probs[0];
  const second = probs[1];

  const gap =
    highest - second;


  return Math.min(
    95,
    Math.round(
      55 +
      gap +
      highest * 0.3,
    ),
  );
};



// =========================
// AUTO PREDICTION
// =========================

const getAutoPrediction = (
  home: number,
  draw: number,
  away: number,
) => {

  const max =
    Math.max(
      home,
      draw,
      away,
    );


  if (max === draw)
    return 'DRAW';


  if (max === home)
    return 'HOME';


  return 'AWAY';
};

const getMarketConfig = (
  market:string,
) => {

  return PredictionMarketOptions.find(
    item =>
      item.value === market,
  );

};

const dynamicPlayerMarkets = [

  PredictionMarkets.ANYTIME_GOALSCORER,

  PredictionMarkets.FIRST_GOALSCORER,

  PredictionMarkets.PLAYER_SHOTS,

  PredictionMarkets.PLAYER_SHOTS_ON_TARGET,

  PredictionMarkets.PLAYER_ASSISTS,

];



export default function PredictionModal({
  match,
  onClose,
  onSubmit,
  loading,
}: PredictionModalProps) {


  const [homeProb, setHomeProb] =
    useState('');

  const [drawProb, setDrawProb] =
    useState('');

  const [awayProb, setAwayProb] =
    useState('');


  const [markets, setMarkets] =
    useState<MarketItem[]>([]);


  const [accessType, setAccessType] =
    useState<
      'free' | 'regular' | 'vip'
    >('free');


  const [price, setPrice] =
    useState('');


  const [error, setError] =
    useState('');



  const home =
    Number(homeProb) || 0;


  const draw =
    Number(drawProb) || 0;


  const away =
    Number(awayProb) || 0;


  const total =
    home + draw + away;


  const confidence =
    total === 100
      ? calculateConfidence(
          home,
          draw,
          away,
        )
      : 0;



  const autoPrediction =
    getAutoPrediction(
      home,
      draw,
      away,
    );



  const addMarket = () => {

    setMarkets([
      ...markets,
      {
        market: '',
        selection: '',
      },
    ]);

  };

  const updateMarketSelection = (
  index:number,
  value:string,
) => {

  const updated =
    [...markets];


  updated[index] = {

    ...updated[index],

    selection:value,

  };


  setMarkets(updated);

};



  const removeMarket = (
    index: number,
  ) => {

    setMarkets(
      markets.filter(
        (_, i) =>
          i !== index,
      ),
    );

  };



  const handleAccessChange = (
    value:
      | 'free'
      | 'regular'
      | 'vip',
  ) => {

    setAccessType(value);


    if (value === 'free') {
      setPrice('0');
    }

  };



  const handleSubmit = () => {

    setError('');


    if (total !== 100) {

      setError(
        'Probabilities must equal exactly 100%.',
      );

      return;

    }



    const numericPrice =
      Number(price);



    if (
      accessType !== 'free' &&
      (
        !price ||
        numericPrice <= 0
      )
    ) {

      setError(
        'Price is required for paid predictions.',
      );

      return;

    }



const cleanedMarkets =
markets
.filter(
  m=>m.market,
)
.map(
  (m)=>{


    let finalSelection =
      m.selection;



    // Dynamic player markets
    if(
      dynamicPlayerMarkets.includes(
        m.market as any,
      )
      &&
      m.playerName
    ){

      const selectedOption =
        getMarketConfig(
          m.market,
        )
        ?.selections.find(
          item =>
            item.value === m.selection,
        );


      const baseText =
        m.customValue
        ||
        selectedOption?.label
        ||
        '';



      finalSelection =
        `${m.playerName} ${baseText}`;

    }



    return {

      market:
        m.market,


      selection:
        finalSelection,

    };

  },
);


    onSubmit({

      prediction:
        autoPrediction,


      confidence,


      probabilities: {
        home,
        draw,
        away,
      },


      markets:
        cleanedMarkets,


      accessType,


      price:
        accessType === 'free'
          ? 0
          : numericPrice,

    });

  };



  return (

    <div
      className="
        fixed
        inset-0
        z-50
        flex
        items-center
        justify-center
        bg-black/50
        backdrop-blur-sm
        p-4
        animate-in
        fade-in
        duration-200
      "
    >

      <div
        className="
          flex
          max-h-[90vh]
          w-full
          max-w-4xl
          flex-col
          overflow-hidden
          rounded-2xl
          border
          border-border
          bg-background
          shadow-2xl
          animate-in
          zoom-in-95
          slide-in-from-bottom-4
          duration-300
        "
      >


        {/* HEADER */}

        <div
          className="
            sticky
            top-0
            border-b
            border-border
            bg-background/90
            p-6
            backdrop-blur
          "
        >

          <h2
            className="
              text-xl
              font-bold
            "
          >
            Create Prediction
          </h2>


          <p
            className="
              text-sm
              text-muted-foreground
            "
          >
            {match.homeTeam}
            {' '}
            vs
            {' '}
            {match.awayTeam}
          </p>


        </div>



        {/* BODY */}

        <div
          className="
            flex-1
            space-y-6
            overflow-y-auto
            p-6
          "
        >


          {error && (

            <div
              className="
                rounded-xl
                border
                border-destructive/30
                bg-destructive/10
                px-4
                py-3
                text-sm
                text-destructive
              "
            >
              {error}
            </div>

          )}



          <div
            className="
              rounded-xl
              border
              border-border
              bg-muted/40
              p-4
            "
          >

            <p
              className="
                text-xs
                text-muted-foreground
              "
            >
              Auto Prediction
            </p>


            <p
              className="
                mt-1
                text-lg
                font-bold
                text-primary
              "
            >
              {autoPrediction}
            </p>

          </div>

                    {/* PROBABILITIES */}

          <div
            className="
              grid
              gap-4
              md:grid-cols-3
            "
          >

            <input
              type="number"
              min="0"
              max="100"
              placeholder={`${match.homeTeam} %`}
              value={homeProb}
              onChange={(e) =>
                setHomeProb(
                  e.target.value,
                )
              }
              className="
                rounded-xl
                border
                border-border
                bg-background
                px-4
                py-3
                outline-none
                transition
                focus:ring-2
                focus:ring-primary/30
              "
            />


            <input
              type="number"
              min="0"
              max="100"
              placeholder="Draw %"
              value={drawProb}
              onChange={(e) =>
                setDrawProb(
                  e.target.value,
                )
              }
              className="
                rounded-xl
                border
                border-border
                bg-background
                px-4
                py-3
                outline-none
                transition
                focus:ring-2
                focus:ring-primary/30
              "
            />


            <input
              type="number"
              min="0"
              max="100"
              placeholder={`${match.awayTeam} %`}
              value={awayProb}
              onChange={(e) =>
                setAwayProb(
                  e.target.value,
                )
              }
              className="
                rounded-xl
                border
                border-border
                bg-background
                px-4
                py-3
                outline-none
                transition
                focus:ring-2
                focus:ring-primary/30
              "
            />


          </div>




          {/* SUMMARY */}

          <div
            className="
              rounded-xl
              border
              border-border
              bg-muted/40
              p-4
              space-y-3
            "
          >

            <div
              className="
                flex
                justify-between
              "
            >

              <span
                className="
                  text-sm
                  text-muted-foreground
                "
              >
                Probability Total
              </span>


              <span
                className={
                  total === 100
                    ? 'font-semibold text-primary'
                    : 'font-semibold text-destructive'
                }
              >
                {total}%
              </span>

            </div>



            <div
              className="
                flex
                justify-between
              "
            >

              <span
                className="
                  text-sm
                  text-muted-foreground
                "
              >
                Confidence
              </span>


              <span
                className="
                  font-bold
                  text-primary
                "
              >
                {confidence}%
              </span>

            </div>

          </div>






          {/* MARKETS */}

          <div
            className="
              space-y-4
            "
          >

            <div
              className="
                flex
                items-center
                justify-between
              "
            >

              <h3
                className="
                  font-semibold
                "
              >
                Markets
              </h3>


              <button
                type="button"
                onClick={addMarket}
                className="
                  rounded-lg
                  px-3
                  py-2
                  text-sm
                  font-medium
                  text-primary
                  transition
                  hover:bg-primary/10
                "
              >
                + Add Market
              </button>


            </div>





            {markets.map(
              (
                market,
                index,
              ) => (

                <div
                  key={index}
                  className="
                    space-y-3
                    rounded-xl
                    border
                    border-border
                    bg-muted/30
                    p-4
                    animate-in
                    fade-in
                    slide-in-from-top-2
                  "
                >


                 <select
value={market.market}
onChange={(e)=>{

 const value =
 e.target.value;


 const updated =
 [...markets];


 updated[index] = {

   ...updated[index],

   market:value,

   selection:'',

   playerName:'',

   line:'',

 };


 setMarkets(updated);

}}
className="
w-full
rounded-xl
border
border-border
bg-background
px-4
py-3
"
>

<option value="">
Select Market
</option>


{PredictionMarketOptions.map(
(item)=>(

<option
key={item.value}
value={item.value}
>
{item.label}
</option>

))
}


</select>


{
market.market && (

<select

value={
market.selection
}

onChange={(e)=>
updateMarketSelection(
index,
e.target.value,
)
}

className="
w-full
rounded-xl
border
border-border
bg-background
px-4
py-3
"

>

<option value="">
Select Prediction
</option>


{
getMarketConfig(
market.market,
)
?.selections.map(
(option)=>(

<option
key={option.value}
value={option.value}
>

{option.label}

</option>

))
}


</select>

)
}

{
dynamicPlayerMarkets.includes(
market.market as any,
)

&& (

<input

type="text"

placeholder="Player name"

value={
market.playerName || ''
}

onChange={(e)=>{

const updated =
[...markets];


updated[index]
.playerName =
e.target.value;


setMarkets(updated);

}}

className="
w-full
rounded-xl
border
border-border
bg-background
px-4
py-3
"

/>

)
}

{
dynamicPlayerMarkets.includes(
market.market as any,
)

&& (

<input

type="text"

placeholder="Override selection text (optional)"

value={
market.customValue || ''
}

onChange={(e)=>{

const updated =
[...markets];


updated[index]
.customValue =
e.target.value;


setMarkets(updated);

}}

className="
w-full
rounded-xl
border
border-border
bg-background
px-4
py-3
"

/>

)

}



                  <button
                    type="button"
                    onClick={() =>
                      removeMarket(
                        index,
                      )
                    }
                    className="
                      text-sm
                      text-destructive
                      transition
                      hover:underline
                    "
                  >
                    Remove Market
                  </button>


                </div>

              ),
            )}

          </div>






          {/* ACCESS TYPE */}

          <div
            className="
              grid
              gap-4
              md:grid-cols-2
            "
          >

            <select
              value={accessType}
              onChange={(e) =>
                handleAccessChange(
                  e.target.value as
                    | 'free'
                    | 'regular'
                    | 'vip',
                )
              }
              className="
                rounded-xl
                border
                border-border
                bg-background
                px-4
                py-3
              "
            >

              <option value="free">
                Free
              </option>

              <option value="regular">
                Regular
              </option>

              <option value="vip">
                VIP
              </option>


            </select>




            <input
              type="number"
              disabled={
                accessType === 'free'
              }
              placeholder="Price"
              value={price}
              onChange={(e) =>
                setPrice(
                  e.target.value,
                )
              }
              className="
                rounded-xl
                border
                border-border
                bg-background
                px-4
                py-3
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            />


          </div>



        </div>






        {/* FOOTER */}


        <div
          className="
            flex
            gap-3
            border-t
            border-border
            bg-muted/30
            p-6
          "
        >

          <button
            onClick={onClose}
            disabled={loading}
            className="
              flex-1
              rounded-xl
              border
              border-border
              px-4
              py-3
              font-medium
              transition
              hover:bg-muted
              disabled:opacity-50
            "
          >
            Cancel
          </button>



          <button
            onClick={handleSubmit}
            disabled={loading}
            className="
              flex-1
              rounded-xl
              bg-primary
              px-4
              py-3
              font-semibold
              text-primary-foreground
              transition
              hover:scale-[1.02]
              active:scale-95
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >

            {loading
              ? 'Saving...'
              : 'Create Prediction'}

          </button>


        </div>



      </div>


    </div>

  );
}