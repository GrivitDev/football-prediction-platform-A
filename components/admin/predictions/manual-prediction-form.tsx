'use client';

import {
  useState,
} from 'react';


interface ManualPredictionFormProps {
  onCreateMatch: (match: any) => void;
}


export default function ManualPredictionForm({
  onCreateMatch,
}: ManualPredictionFormProps) {


  const [homeTeam, setHomeTeam] =
    useState('');

  const [awayTeam, setAwayTeam] =
    useState('');

  const [leagueCode, setLeagueCode] =
    useState('');

  const [matchDate, setMatchDate] =
    useState('');

  const [error, setError] =
    useState('');



  const handleCreate = () => {

    setError('');



    if (
      !homeTeam ||
      !awayTeam ||
      !leagueCode ||
      !matchDate
    ) {

      setError(
        'Please complete all fields before creating a prediction.',
      );

      return;

    }



    onCreateMatch({

      id:
        `manual-${Date.now()}`,

      leagueCode,

      homeTeam,

      awayTeam,

      date:
        matchDate,

      status:
        'SCHEDULED',

    });



    setHomeTeam('');

    setAwayTeam('');

    setLeagueCode('');

    setMatchDate('');

  };



  return (

    <div
      className="
        rounded-2xl
        border
        border-border
        bg-background
        p-6
        shadow-sm
        transition-all
        duration-300
        hover:shadow-lg
        animate-in
        fade-in
        slide-in-from-bottom-3
      "
    >


      <div
        className="
          mb-6
          space-y-1
        "
      >

        <h2
          className="
            text-xl
            font-semibold
          "
        >
          Manual Prediction
        </h2>


        <p
          className="
            text-sm
            text-muted-foreground
          "
        >
          Create a custom fixture when it is not
          available through the football API.
        </p>

      </div>





      {error && (

        <div
          className="
            mb-5
            rounded-xl
            border
            border-destructive/30
            bg-destructive/10
            px-4
            py-3
            text-sm
            text-destructive
            animate-in
            fade-in
            slide-in-from-top-2
          "
        >
          {error}
        </div>

      )}






      <div
        className="
          grid
          gap-4
          md:grid-cols-2
        "
      >

        <input
          placeholder="Home Team"
          value={homeTeam}
          onChange={(e) =>
            setHomeTeam(
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
          placeholder="Away Team"
          value={awayTeam}
          onChange={(e) =>
            setAwayTeam(
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
          placeholder="League Code"
          value={leagueCode}
          onChange={(e) =>
            setLeagueCode(
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
          type="datetime-local"
          value={matchDate}
          onChange={(e) =>
            setMatchDate(
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






      <button
        onClick={handleCreate}
        className="
          mt-6
          w-full
          rounded-xl
          bg-primary
          px-5
          py-3
          font-semibold
          text-primary-foreground
          transition-all
          duration-200
          hover:scale-[1.02]
          hover:shadow-lg
          active:scale-95
        "
      >

        Create Manual Prediction

      </button>


    </div>

  );

}