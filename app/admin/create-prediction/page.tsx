'use client';

import {
  useEffect,
  useState,
} from 'react';

import Image from 'next/image';

import toast from 'react-hot-toast';

import {
  createPrediction,
} from '@/services/prediction.service';

import {
  getFixtures,
  getLeagues,
  League,
  Match,
} from '@/services/sports.service';

import PredictionModal from '@/components/admin/predictions/prediction-modal';
import ManualPredictionForm from '@/components/admin/predictions/manual-prediction-form';


export default function CreatePredictionPage() {
  const [leagues, setLeagues] =
    useState<League[]>([]);

  const [matches, setMatches] =
    useState<Match[]>([]);

  const [selectedLeague, setSelectedLeague] =
    useState('');

  const [selectedMatch, setSelectedMatch] =
    useState<Match | null>(null);

  const [loadingLeagues, setLoadingLeagues] =
    useState(false);

  const [loadingMatches, setLoadingMatches] =
    useState(false);

  const [showModal, setShowModal] =
    useState(false);

  const [submitting, setSubmitting] =
    useState(false);

  const [error, setError] =
    useState('');


  useEffect(() => {
    const loadLeagues = async () => {
      try {
        setLoadingLeagues(true);
        setError('');

        const data =
          await getLeagues();

        setLeagues(data || []);

      } catch (err) {
        console.log(err);

        setError(
          'Unable to load leagues. Please try again.',
        );

      } finally {
        setLoadingLeagues(false);
      }
    };


    loadLeagues();

  }, []);



  const handleLeagueChange =
    async (
      leagueCode: string,
    ) => {

      setSelectedLeague(
        leagueCode,
      );

      setMatches([]);

      setError('');


      if (!leagueCode) return;


      try {

        setLoadingMatches(true);


        const data =
          await getFixtures(
            leagueCode,
          );


        setMatches(
          data || [],
        );


      } catch (err) {

        console.log(err);

        setError(
          'Unable to load fixtures for this league.',
        );


      } finally {

        setLoadingMatches(false);

      }

    };



  const openModal =
    (
      match: Match,
    ) => {

      setSelectedMatch(
        match,
      );

      setShowModal(true);

    };



  const handleManualMatch =
    (
      match: Match,
    ) => {

      setSelectedMatch(
        match,
      );

      setShowModal(true);

    };



  const closeModal =
    () => {

      setSelectedMatch(null);

      setShowModal(false);

    };



  const handleSubmit =
    async (
      payload: any,
    ) => {

      if (!selectedMatch)
        return;

        console.log(
    'SELECTED MATCH',
    selectedMatch,
  );


      try {

        setSubmitting(true);


       await createPrediction({

  matchId:
    selectedMatch.id,

  leagueCode:
    selectedMatch.leagueCode,

league:{
  code:
    selectedMatch.league.code,

  name:
    selectedMatch.league.name,

  country:
    selectedMatch.league.country,

  emblem:
    selectedMatch.league.emblem,
},

  homeTeam:
    selectedMatch.homeTeam,

  awayTeam:
    selectedMatch.awayTeam,

  homeTeamBadge:
    selectedMatch.homeTeamBadge,

  awayTeamBadge:
    selectedMatch.awayTeamBadge,

  confidence:
    Number(payload.confidence),


  probabilities:
    payload.probabilities,


  markets:
    payload.markets,


  accessType:
    payload.accessType,


  price:
    Number(payload.price || 0),


  matchDate:
    selectedMatch.date,

});



        toast.success(
          'Prediction created successfully',
        );


        closeModal();



      } catch (err: any) {


        console.log(
          err?.response?.data,
        );


        toast.error(
          err?.response?.data?.message ||
          'Failed to create prediction',
        );


      } finally {

        setSubmitting(false);

      }

    };



  const currentLeague =
    leagues.find(
      (league) =>
        league.code === selectedLeague,
    );



  return (
    <div
      className="
        mx-auto
        max-w-7xl
        space-y-8
        p-6
        animate-in
        fade-in
        slide-in-from-bottom-4
        duration-500
      "
    >

      {/* HEADER */}

      <div className="space-y-2">

        <h1
          className="
            text-3xl
            font-bold
            tracking-tight
          "
        >
          Create Prediction
        </h1>


        <p
          className="
            text-muted-foreground
          "
        >
          Create automated football predictions
          from fixtures or manually create your own.
        </p>

      </div>



      {/* ERROR */}

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
            animate-in
            fade-in
            slide-in-from-top-2
          "
        >

          {error}

        </div>

      )}



      <div className="space-y-8">


        {/* API SECTION */}

        <section
          className="
            rounded-2xl
            border
            border-border
            bg-card
            p-6
            shadow-sm
            transition-all
            duration-300
            hover:shadow-lg
          "
        >

          <div
            className="
              mb-5
              space-y-1
            "
          >

            <h2
              className="
                text-xl
                font-semibold
              "
            >
              API Predictions
            </h2>


            <p
              className="
                text-sm
                text-muted-foreground
              "
            >
              Select a league and create predictions
              from upcoming fixtures.
            </p>

          </div>



          <select
            value={selectedLeague}
            onChange={(e) =>
              handleLeagueChange(
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
              text-sm
              outline-none
              transition
              focus:ring-2
              focus:ring-primary/30
            "
          >

            <option value="">
              Select League
            </option>


            {leagues.map(
              (league) => (

                <option
                  key={league.code}
                  value={league.code}
                >
                  {league.name}
                  {' '}
                  ({league.country})
                </option>

              ),
            )}

          </select>

                    {loadingLeagues && (

            <div
              className="
                mt-4
                rounded-xl
                border
                border-border
                bg-muted/40
                p-4
                text-sm
                text-muted-foreground
                animate-pulse
              "
            >
              Loading leagues...
            </div>

          )}



          {currentLeague && (

            <div
              className="
                mt-5
                flex
                items-center
                gap-4
                rounded-xl
                border
                border-border
                bg-muted/40
                p-4
                animate-in
                fade-in
                zoom-in-95
                duration-300
              "
            >

              {currentLeague.emblem && (

                <Image
                  src={currentLeague.emblem}
                  alt={currentLeague.name}
                  width={48}
                  height={48}
                  className="
                    h-12
                    w-12
                    object-contain
                  "
                />

              )}


              <div>

                <p
                  className="
                    font-semibold
                  "
                >
                  {currentLeague.name}
                </p>


                <p
                  className="
                    text-sm
                    text-muted-foreground
                  "
                >
                  {currentLeague.country}
                </p>

              </div>

            </div>

          )}



          <div
            className="
              mt-6
              space-y-4
            "
          >

            {loadingMatches && (

              <div
                className="
                  rounded-xl
                  border
                  border-border
                  bg-muted/40
                  p-6
                  text-sm
                  text-muted-foreground
                  animate-pulse
                "
              >
                Loading fixtures...
              </div>

            )}



            {!loadingMatches &&
              matches.length === 0 &&
              selectedLeague && (

                <div
                  className="
                    rounded-xl
                    border
                    border-dashed
                    border-border
                    p-8
                    text-center
                    text-muted-foreground
                  "
                >
                  No upcoming fixtures found for
                  this league.
                </div>

              )}



            {!loadingMatches &&
              matches.map(
                (match) => (

                  <div
                    key={match.id}
                    className="
                      group
                      flex
                      flex-col
                      gap-5
                      rounded-xl
                      border
                      border-border
                      bg-background
                      p-5
                      transition-all
                      duration-300
                      hover:-translate-y-1
                      hover:shadow-md
                      md:flex-row
                      md:items-center
                      md:justify-between
                    "
                  >

                    <div
                      className="
                        space-y-4
                      "
                    >


                      <div
                        className="
                          flex
                          flex-wrap
                          items-center
                          gap-4
                        "
                      >

                        <div
                          className="
                            flex
                            items-center
                            gap-2
                          "
                        >

                          {match.homeTeamBadge && (

                            <Image
                              src={
                                match.homeTeamBadge
                              }
                              alt={
                                match.homeTeam
                              }
                              width={32}
                              height={32}
                              className="
                                object-contain
                              "
                            />

                          )}


                          <span
                            className="
                              font-semibold
                            "
                          >
                            {match.homeTeam}
                          </span>

                        </div>



                        <span
                          className="
                            text-sm
                            font-medium
                            text-muted-foreground
                          "
                        >
                          VS
                        </span>



                        <div
                          className="
                            flex
                            items-center
                            gap-2
                          "
                        >

                          {match.awayTeamBadge && (

                            <Image
                              src={
                                match.awayTeamBadge
                              }
                              alt={
                                match.awayTeam
                              }
                              width={32}
                              height={32}
                              className="
                                object-contain
                              "
                            />

                          )}


                          <span
                            className="
                              font-semibold
                            "
                          >
                            {match.awayTeam}
                          </span>

                        </div>

                      </div>



                      <div
                        className="
                          space-y-1
                          text-sm
                          text-muted-foreground
                        "
                      >

                        <p>
                          {new Date(
                            match.date,
                          ).toLocaleString()}
                        </p>


                        <p>
                          Status:
                          {' '}
                          {match.status}
                        </p>

                      </div>


                    </div>




                    <button
                      onClick={() =>
                        openModal(
                          match,
                        )
                      }
                      className="
                        rounded-xl
                        bg-primary
                        px-5
                        py-2.5
                        text-sm
                        font-semibold
                        text-primary-foreground
                        transition-all
                        duration-200
                        hover:scale-105
                        active:scale-95
                      "
                    >
                      Create Prediction
                    </button>


                  </div>

                ),
              )}

          </div>


        </section>





        {/* MANUAL SECTION */}


        <section
          className="
            rounded-2xl
            border
            border-border
            bg-card
            p-6
            shadow-sm
            transition-all
            duration-300
            hover:shadow-lg
          "
        >

          <div
            className="
              mb-5
              space-y-1
            "
          >

            <h2
              className="
                text-xl
                font-semibold
              "
            >
              Manual Predictions
            </h2>


            <p
              className="
                text-sm
                text-muted-foreground
              "
            >
              Create a prediction without using
              an external fixture.
            </p>


          </div>



          <ManualPredictionForm
            onCreateMatch={
              handleManualMatch
            }
          />


        </section>


      </div>





      {/* MODAL */}


      {showModal &&
        selectedMatch && (

          <PredictionModal
            match={
              selectedMatch
            }
            onClose={
              closeModal
            }
            onSubmit={
              handleSubmit
            }
            loading={
              submitting
            }
          />

        )}


    </div>
  );
}