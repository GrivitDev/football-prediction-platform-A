'use client';

import { useState } from 'react';

interface ManualPredictionFormProps {
  onCreateMatch: (match: any) => void;
}

export default function ManualPredictionForm({
  onCreateMatch,
}: ManualPredictionFormProps) {
  const [homeTeam, setHomeTeam] = useState('');
  const [awayTeam, setAwayTeam] = useState('');
  const [leagueCode, setLeagueCode] = useState('');
  const [matchDate, setMatchDate] = useState('');

  const handleCreate = () => {
    if (!homeTeam || !awayTeam || !leagueCode || !matchDate) {
      alert('Please complete all fields');
      return;
    }

    onCreateMatch({
      id: `manual-${Date.now()}`,
      leagueCode,
      homeTeam,
      awayTeam,
      date: matchDate,
      status: 'SCHEDULED',
    });

    setHomeTeam('');
    setAwayTeam('');
    setLeagueCode('');
    setMatchDate('');
  };

  return (
    <div className="bg-slate-900 rounded-xl p-6">
      <h2 className="text-xl font-bold mb-4">Manual Prediction</h2>

      <div className="grid md:grid-cols-2 gap-4">
        <input
          className="p-3 rounded bg-slate-950"
          placeholder="Home Team"
          value={homeTeam}
          onChange={(e) => setHomeTeam(e.target.value)}
        />

        <input
          className="p-3 rounded bg-slate-950"
          placeholder="Away Team"
          value={awayTeam}
          onChange={(e) => setAwayTeam(e.target.value)}
        />

        <input
          className="p-3 rounded bg-slate-950"
          placeholder="League Code"
          value={leagueCode}
          onChange={(e) => setLeagueCode(e.target.value)}
        />

        <input
          type="datetime-local"
          className="p-3 rounded bg-slate-950"
          value={matchDate}
          onChange={(e) => setMatchDate(e.target.value)}
        />
      </div>

      <button
        onClick={handleCreate}
        className="mt-4 bg-blue-600 px-4 py-3 rounded"
      >
        Create Manual Prediction
      </button>
    </div>
  );
}