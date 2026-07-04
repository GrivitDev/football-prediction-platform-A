'use client';

import {
  useEffect,
  useState,
} from 'react';

import { useAuth } from '@/providers/auth-provider';

import { createPrediction } from '@/services/prediction.service';

import {
  getLeagues,
  getFixtures,
  League,
  Match,
} from '@/services/sports.service';
import Image from 'next/image';

import PredictionModal from '@/components/admin/predictions/prediction-modal';
import ManualPredictionForm from '@/components/admin/predictions/manual-prediction-form';

export default function CreatePredictionPage() {
  const { token } = useAuth();

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

  // LOAD LEAGUES
  useEffect(() => {
    const loadLeagues =
      async () => {
        try {
          setLoadingLeagues(true);

          const data =
            await getLeagues();

          setLeagues(data || []);
        } catch (err) {
          console.log(err);

          setError(
            'Failed to load leagues',
          );
        } finally {
          setLoadingLeagues(false);
        }
      };

    loadLeagues();
  }, []);

  // LEAGUE CHANGE
  const handleLeagueChange =
    async (
      leagueCode: string,
    ) => {
      setSelectedLeague(
        leagueCode,
      );

      setMatches([]);

      if (!leagueCode) return;

      try {
        setLoadingMatches(true);

        const data =
          await getFixtures(
            leagueCode,
          );

        setMatches(data || []);
      } catch (err) {
        console.log(err);

        setError(
          'Failed to load fixtures',
        );
      } finally {
        setLoadingMatches(false);
      }
    };

  // OPEN MODAL (API)
  const openModal = (
    match: Match,
  ) => {
    setSelectedMatch(match);

    setShowModal(true);
  };

  // OPEN MODAL (MANUAL)
  const handleManualMatch = (
    match: any,
  ) => {
    setSelectedMatch(
      match as Match,
    );

    setShowModal(true);
  };

  // CLOSE MODAL
  const closeModal = () => {
    setSelectedMatch(null);

    setShowModal(false);
  };

  // CREATE PREDICTION
  const handleSubmit =
    async (payload: any) => {
      if (!selectedMatch) return;

      try {
        setSubmitting(true);

          await createPrediction({
            matchId: selectedMatch.id,
            leagueCode: selectedMatch.leagueCode,
            homeTeam: selectedMatch.homeTeam,
            awayTeam: selectedMatch.awayTeam,

            confidence: Number(payload.confidence),
            probabilities: payload.probabilities,
            markets: payload.markets,

            accessType: payload.accessType,
            price: Number(payload.price || 0),

            matchDate: selectedMatch.date,
          });
        alert(
          'Prediction created successfully',
        );

        closeModal();
      } catch (err: any) {
        console.log(
          err?.response?.data,
        );

        alert(
          err?.response?.data
            ?.message ||
            'Failed to create prediction',
        );
      } finally {
        setSubmitting(false);
      }
    };

    const currentLeague = leagues.find(
  (league) =>
    league.code === selectedLeague,
);

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">
        Create Prediction
      </h1>

      {error && (
        <p className="text-red-500 mb-4">
          {error}
        </p>
      )}

      <div className="space-y-8">

        {/* API SECTION */}
        <section className="bg-slate-950 border border-slate-800 rounded-xl p-6">
          <h2 className="text-2xl font-bold mb-4">
            API Predictions
          </h2>

          <select
            className="w-full p-3 bg-slate-900 rounded"
            value={selectedLeague}
            onChange={(e) =>
              handleLeagueChange(
                e.target.value,
              )
            }
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
                  {league.name} (
                  {league.country})
                </option>
              ),
            )}
          </select>

          {currentLeague && (
            <div className="mt-4 flex items-center gap-3 bg-slate-900 p-3 rounded-lg">
              {currentLeague.emblem && (
                <Image
                  src={currentLeague.emblem}
                  alt={currentLeague.name}
                  width={48}
                  height={48}
                  className="w-12 h-12 object-contain"
                />
              )}

              <div>
                <p className="font-semibold">
                  {currentLeague.name}
                </p>

                <p className="text-sm text-gray-400">
                  {currentLeague.country}
                </p>
              </div>
            </div>
          )}

          <div className="mt-6 space-y-3">
            {loadingMatches && (
              <p className="text-gray-400">
                Loading
                matches...
              </p>
            )}

            {!loadingMatches &&
              matches.length ===
                0 &&
              selectedLeague && (
                <p className="text-gray-400">
                  No fixtures found
                </p>
              )}

            {!loadingMatches &&
              matches.map(
                (match) => (
                  <div
                    key={
                      match.id
                    }
                    className="p-4 bg-slate-900 rounded flex justify-between items-center"
                  >
                    <div className="flex flex-col gap-3">

                        <div className="flex items-center gap-4">

                          <div className="flex items-center gap-2">
                            {match.homeTeamBadge && (
                              <Image
                                src={match.homeTeamBadge}
                                alt={match.homeTeam}
                                width={32}
                                height={32}
                                className="object-contain"
                              />
                            )}

                            <span className="font-semibold">
                              {match.homeTeam}
                            </span>
                          </div>

                          <span className="text-slate-500">
                            VS
                          </span>

                          <div className="flex items-center gap-2">
                            {match.awayTeamBadge && (
                              <Image
                                src={match.awayTeamBadge}
                                alt={match.awayTeam}
                                width={32}
                                height={32}
                                className="object-contain"
                              />
                            )}

                            <span className="font-semibold">
                              {match.awayTeam}
                            </span>
                          </div>

                        </div>

                        <p className="text-sm text-gray-400">
                          {new Date(
                            match.date,
                          ).toLocaleString()}
                        </p>

                        <p className="text-sm text-gray-500">
                          Status: {match.status}
                        </p>

                      </div>

                    <button
                      onClick={() =>
                        openModal(
                          match,
                        )
                      }
                      className="bg-green-600 hover:bg-green-500 px-4 py-2 rounded"
                    >
                      Create
                      Prediction
                    </button>
                  </div>
                ),
              )}
          </div>
        </section>

        {/* MANUAL SECTION */}
        <section className="bg-slate-950 border border-slate-800 rounded-xl p-6">
          <h2 className="text-2xl font-bold mb-4">
            Manual Predictions
          </h2>

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