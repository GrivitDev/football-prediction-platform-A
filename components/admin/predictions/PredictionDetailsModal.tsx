'use client';

import {
  getLeagueName,
} from '@/constants/leagues';

import Image from 'next/image';

type Props = {
  prediction: any;
  onClose: () => void;

  settlementResult: string;
  setSettlementResult: (value: any) => void;

  probabilityTotal: number;

  updateProbability: (
    field: 'home' | 'draw' | 'away',
    value: number,
  ) => void;

  updateMarketSelection: (
    index: number,
    value: string,
  ) => void;

  saveEdit: () => void;
  deleteItem: () => void;
};

const getSettlementStatus = (prediction: any) => {
  const now = new Date();

  const matchTime =
    new Date(
      prediction.matchDate,
    );

  const settlementTime =
    new Date(
      matchTime.getTime() + 2 * 60 * 60 * 1000,
    );


  if (prediction.settled) {
    return {
      type: 'settled',
      label: 'Settled',
      icon: '✓',
    };
  }


  if (now >= settlementTime) {
    return {
      type: 'pending',
      label: 'Awaiting Settlement',
      icon: '!',
    };
  }


  return {
    type: 'upcoming',
    label: 'Scheduled',
    icon: '•',
  };
};

export default function PredictionDetailsModal({
  prediction,
  onClose,
  settlementResult,
  setSettlementResult,
  probabilityTotal,
  updateProbability,
  updateMarketSelection,
  saveEdit,
  deleteItem,
}: Props) {


  if (!prediction)
    return null;

const settlementStatus =
  getSettlementStatus(prediction);

  const predictionHero = (() => {
  switch (prediction.prediction) {
    case 'HOME':
      return {
        badge: prediction.homeTeamBadge,
        title: `${prediction.homeTeam} To Win`,
      };

    case 'AWAY':
      return {
        badge: prediction.awayTeamBadge,
        title: `${prediction.awayTeam} To Win`,
      };

    case 'DRAW':
      return {
        badge: undefined,
        title: 'Draw',
      };

    default:
      return {
        badge: undefined,
        title: prediction.prediction,
      };
  }
})();

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
          max-h-[92vh]
          w-full
          max-w-5xl
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


<div
  className="
    border-b
    border-border
    bg-gradient-to-b
    from-muted/40
    via-background
    to-background
    px-2
    py-2
  "
>

  {/* Top Bar */}

  <div className="mb-1 flex items-center justify-between">

    <span
      className={`
        inline-flex
        items-center
        gap-2
        rounded-full
        px-5
        py-2
        text-sm
        font-semibold

        ${
          settlementStatus.type === 'settled'
            ? 'bg-green-500/10 text-green-600'
            : settlementStatus.type === 'pending'
              ? 'bg-yellow-500/10 text-yellow-600'
              : 'bg-muted text-muted-foreground'
        }
      `}
    >
      <span>{settlementStatus.icon}</span>

      {settlementStatus.label}
    </span>

    <button
      onClick={onClose}
      className="
        rounded-xl
        border
        border-border
        px-4
        py-2
        text-sm
        transition
        hover:bg-muted
      "
    >
      Close
    </button>

  </div>
 </div>

        {/* HEADER */}


        <div
          className="
            flex-1
            space-y-8
            overflow-y-auto
            p-6
          "
        >

<div
  className="
    border-b
    border-border
    bg-gradient-to-b
    from-muted/40
    via-background
    to-background
  "
>


  {/* LEAGUE */}

  <div className="flex -mt-8 flex-col items-center">

    {prediction.league?.emblem && (

      <Image
        src={prediction.league.emblem}
        alt={prediction.league.name}
        width={40}
        height={40}
        className="object-contain"
      />

    )}

    <h2
      className="
        text-l
        font-bold
        uppercase
        tracking-widest
        text-center
      "
    >
      {
        prediction.league?.name ??
        getLeagueName(prediction.leagueCode)
      }
    </h2>

  </div>





  {/* TEAMS */}

  <div
    className="
      flex
      items-center
      justify-between
      gap-1
      mb-4
    "
  >

    {/* Home */}

    <div
      className="
        flex-1
        flex
        flex-col
        items-center
      "
    >

      {prediction.homeTeamBadge && (

        <Image
          src={prediction.homeTeamBadge}
          alt={prediction.homeTeam}
          width={40}
          height={40}
          className="
            object-contain
          "
        />

      )}

      <h3
        className="
          text-s
          font-bold
          text-center
        "
      >
        {prediction.homeTeam}
      </h3>

    </div>





    {/* VS */}

    <div
      className="
        flex
        h-10
        w-10
        shrink-0
        items-center
        justify-center
        rounded-full
        border-2
        border-border
        bg-background
        text-l
        font-black
        shadow-sm
      "
    >
      VS
    </div>





    {/* Away */}

    <div
      className="
        flex-1
        flex
        flex-col
        items-center
      "
    >

      {prediction.awayTeamBadge && (

        <Image
          src={prediction.awayTeamBadge}
          alt={prediction.awayTeam}
          width={40}
          height={40}
          className="
            object-contain
          "
        />

      )}

      <h3
        className="
          text-s
          font-bold
          text-center
        "
      >
        {prediction.awayTeam}
      </h3>

    </div>

  </div>





  {/* PREDICTION */}

  <div
    className="
      mx-auto
      mt-2
      max-w-xl
      rounded-3xl
      border
      border-primary/20
      bg-primary/4
      px-1
      py-1
      mb-4
    "
  >

    <p
      className="
        text-center
        text-xs
        font-bold
        uppercase
        tracking-[0.35em]
        text-primary
      "
    >
      Prediction
    </p>

    <div
      className="
        flex
        items-center
        justify-center
        gap-2
      "
    >

      {predictionHero.badge && (

        <Image
          src={predictionHero.badge}
          alt={predictionHero.title}
          width={32}
          height={32}
          className="
          mb-4
            object-contain
          "
        />

      )}

      <div className="text-center">

        <h3
          className="
            text-xs
            font-bold
          "
        >
          {predictionHero.title}
        </h3>

        <p
          className="
            mt-0
            text-base
            text-muted-foreground
          "
        >
          Confidence {prediction.confidence}%
        </p>

      </div>

    </div>

  </div>

</div>



          {/* MATCH INFORMATION */}

          <Section title="Match Information">

            <div
              className="
                grid
                gap-3
                md:grid-cols-2
              "
            >

              <Info
                label="Match ID"
                value={
                  prediction.matchId
                }
              />


              <Info
                label="League"
                value={
                  getLeagueName(
                    prediction.leagueCode,
                  )
                }
              />


              <Info
                label="Home Team"
                value={
                  prediction.homeTeam
                }
              />


              <Info
                label="Away Team"
                value={
                  prediction.awayTeam
                }
              />


              <Info
                label="Match Date"
                value={
                  new Date(
                    prediction.matchDate,
                  )
                  .toLocaleString()
                }
              />


            </div>

          </Section>







          {/* PREDICTION */}

          <Section title="Prediction Information">


            <div
              className="
                grid
                gap-3
                md:grid-cols-3
              "
            >

              <Info
                label="Prediction"
                value={
                  prediction.prediction
                }
              />


              <Info
                label="Confidence"
                value={
                  `${prediction.confidence}%`
                }
              />


              <Info
                label="Access"
                value={
                  prediction.accessType
                }
              />


              <Info
                label="Price"
                value={
                  `₦${prediction.price}`
                }
              />


              <Info
                label="Status"
                value={
                  prediction.status
                }
              />


              <Info
                label="Settled"
                value={
                  prediction.settled
                    ? 'Yes'
                    : 'No'
                }
              />


            </div>


          </Section>









          {/* PROBABILITIES */}

          <Section title="Probabilities">


            <div
              className="
                mb-4
                rounded-xl
                border
                border-border
                bg-muted/40
                p-4
              "
            >

              <div
                className="
                  flex
                  justify-between
                "
              >

                <span>
                  Total
                </span>


                <span
                  className={
                    probabilityTotal === 100
                    ? 'text-primary font-semibold'
                    : 'text-destructive font-semibold'
                  }
                >
                  {probabilityTotal}%
                </span>


              </div>


            </div>





            <div
              className="
                grid
                gap-3
                md:grid-cols-3
              "
            >

              {(
                [
                  'home',
                  'draw',
                  'away',
                ] as const
              )
              .map(
                (field) => (

                  <input
                    key={field}
                    type="number"
                    value={
                      prediction.probabilities[field]
                    }
                    onChange={(e) =>
                      updateProbability(
                        field,
                        Number(
                          e.target.value,
                        ),
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
                      focus:ring-2
                      focus:ring-primary/30
                    "
                  />

                ),
              )}


            </div>


          </Section>









          {/* MARKETS */}

          <Section
            title={`Markets (${prediction.markets?.length || 0})`}
          >

            <div
              className="
                grid
                gap-4
                md:grid-cols-2
              "
            >

              {
                prediction.markets?.map(
                  (
                    market:any,
                    index:number,
                  ) => (

                    <div
                      key={index}
                      className="
                        rounded-xl
                        border
                        border-border
                        bg-muted/30
                        p-4
                      "
                    >

                      <p
                        className="
                          mb-2
                          text-xs
                          uppercase
                          text-muted-foreground
                        "
                      >
                        {
                          market.market
                        }
                      </p>


                      <input
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
                          px-3
                          py-2
                        "
                      />

                    </div>

                  ),
                )
              }

            </div>

          </Section>









          {/* SETTLEMENT */}

          <Section title="Settlement">

{settlementStatus.type === 'pending' && (
  <div
    className="
      rounded-xl
      border
      border-yellow-500/30
      bg-yellow-500/10
      p-4
      text-sm
      text-yellow-700
    "
  >
    This match has passed the settlement window.
    Please enter the final result.
  </div>
)}
            <select
              value={
                settlementResult
              }
              onChange={(e)=>
                setSettlementResult(
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
                Settle Match
              </option>


              <option value="HOME">
                {prediction.homeTeam} Won
              </option>


              <option value="DRAW">
                Draw
              </option>


              <option value="AWAY">
                {prediction.awayTeam} Won
              </option>


              <option value="VOID">
                Void
              </option>


            </select>



            {prediction.settledAt && (

              <div className="mt-4">

                <Info
                  label="Settled At"
                  value={
                    new Date(
                      prediction.settledAt,
                    )
                    .toLocaleString()
                  }
                />

              </div>

            )}


          </Section>








          {/* SYSTEM */}

          <Section title="System Information">


            <div
              className="
                grid
                gap-3
                md:grid-cols-2
              "
            >

              <Info
                label="Created"
                value={
                  new Date(
                    prediction.createdAt,
                  )
                  .toLocaleString()
                }
              />


              <Info
                label="Updated"
                value={
                  new Date(
                    prediction.updatedAt,
                  )
                  .toLocaleString()
                }
              />


              <Info
                label="Deleted"
                value={
                  prediction.deleted
                    ? 'Yes'
                    : 'No'
                }
              />


            </div>


          </Section>



        </div>






{/* FOOTER */}

<div
  className="
    flex
    items-center
    justify-between
    gap-4
    border-t
    border-border
    bg-muted/20
    px-6
    py-4
  "
>

  <div
    className="
      text-xs
      text-muted-foreground
    "
  >
    Changes are applied immediately
  </div>


  <div
    className="
      flex
      gap-3
    "
  >

    <button
      onClick={deleteItem}
      className="
        flex
        h-11
        items-center
        gap-2
        rounded-xl
        border
        border-destructive/30
        px-5
        text-sm
        font-medium
        text-destructive
        transition-all
        duration-200

        hover:bg-destructive
        hover:text-white
        hover:shadow-md
        hover:shadow-destructive/20

        active:scale-95
      "
    >

      <span
        className="
          h-2
          w-2
          rounded-full
          bg-destructive
          transition-colors
          group-hover:bg-white
        "
      />

      Delete

    </button>



    <button
      onClick={saveEdit}
      disabled={
        !settlementResult &&
        probabilityTotal !== 100
      }
      className="
        flex
        h-11
        items-center
        gap-2
        rounded-xl
        border
        border-primary
        bg-primary
        px-7
        text-sm
        font-semibold
        text-primary-foreground

        transition-all
        duration-200

        hover:-translate-y-0.5
        hover:shadow-lg
        hover:shadow-primary/25

        active:translate-y-0
        active:scale-95

        disabled:pointer-events-none
        disabled:opacity-40
      "
    >

      <span
        className="
          flex
          h-5
          w-5
          items-center
          justify-center
          rounded-full
          bg-white/20
          text-xs
        "
      >
        ✓
      </span>


      {
        settlementResult
          ? 'Settle Prediction'
          : 'Save Changes'
      }

    </button>


  </div>


</div>


      </div>


    </div>

  );
}






function Section({
  title,
  children,
}: {
  title:string;
  children:React.ReactNode;
}) {

  return (

    <section
      className="
        space-y-4
      "
    >

      <h3
        className="
          text-lg
          font-semibold
        "
      >
        {title}
      </h3>


      {children}


    </section>

  );

}





function Info({
  label,
  value,
}: {
  label:string;
  value:any;
}) {

  return (

    <div
      className="
        rounded-xl
        border
        border-border
        bg-muted/20
        p-4
      "
    >

      <p
        className="
          text-xs
          text-muted-foreground
        "
      >
        {label}
      </p>


      <p
        className="
          mt-1
          font-medium
        "
      >
        {value ?? '-'}
      </p>


    </div>

  );

}