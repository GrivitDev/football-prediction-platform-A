'use client';

import { useEffect, useMemo, useState } from 'react';
import api from '@/lib/axios';
import PredictionModal from '@/components/predictions/PredictionModal';
import { formatMatchTime } from '@/lib/formatMatchTime';

export default function PredictionsPage() {
  const [predictions, setPredictions] = useState<any[]>([]);
  const [selected, setSelected] = useState<any | null>(null);

  // =========================
  // FILTER STATES
  // =========================
  const [search, setSearch] = useState('');
  const [league, setLeague] = useState('all');
  const [minConfidence, setMinConfidence] = useState(0);
  const [dateFilter, setDateFilter] = useState('all');

  useEffect(() => {
    const fetchPredictions = async () => {
      const res = await api.get('/predictions');
      setPredictions(res.data);
    };

    fetchPredictions();
  }, []);

  // =========================
  // SORT + FILTER LOGIC
  // =========================
  const filtered = useMemo(() => {
    const now = Date.now();

    return predictions
      .filter((p) => {
        const matchTime = new Date(p.matchDate).getTime();

        // league filter
        if (league !== 'all' && p.leagueCode !== league) return false;

        // search filter (teams)
        if (
          search &&
          !(
            p.homeTeam.toLowerCase().includes(search.toLowerCase()) ||
            p.awayTeam.toLowerCase().includes(search.toLowerCase())
          )
        ) {
          return false;
        }

        // confidence filter
        if (p.confidence < minConfidence) return false;

        // date filter
        if (dateFilter === 'upcoming' && matchTime < now) return false;
        if (dateFilter === 'past' && matchTime > now) return false;

        return true;
      })
      .sort((a, b) => {
        const aTime = new Date(a.matchDate).getTime();
        const bTime = new Date(b.matchDate).getTime();

        const now = Date.now();

        const aPast = aTime < now;
        const bPast = bTime < now;

        // upcoming first, past last
        if (aPast !== bPast) return aPast ? 1 : -1;

        // otherwise sort by nearest date
        return aTime - bTime;
      });
  }, [predictions, search, league, minConfidence, dateFilter]);

  // =========================
  // UNIQUE LEAGUES
  // =========================
  const leagues = useMemo(() => {
    const set = new Set(predictions.map((p) => p.leagueCode));
    return Array.from(set);
  }, [predictions]);

  return (
    <div className="space-y-6">

      <h1 className="text-white text-2xl font-bold">
        Predictions
      </h1>

      {/* =========================
          FILTER BAR
      ========================= */}
      <div className="grid grid-cols-4 gap-3 bg-gray-900 p-3 rounded-xl">

        {/* SEARCH */}
        <input
          placeholder="Search teams..."
          className="bg-gray-800 text-white p-2 rounded"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* LEAGUE */}
        <select
          className="bg-gray-800 text-white p-2 rounded"
          value={league}
          onChange={(e) => setLeague(e.target.value)}
        >
          <option value="all">All Leagues</option>
          {leagues.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </select>

        {/* CONFIDENCE */}
        <select
          className="bg-gray-800 text-white p-2 rounded"
          value={minConfidence}
          onChange={(e) => setMinConfidence(Number(e.target.value))}
        >
          <option value={0}>All Confidence</option>
          <option value={50}>50%+</option>
          <option value={70}>70%+</option>
          <option value={80}>80%+</option>
        </select>

        {/* DATE FILTER */}
        <select
          className="bg-gray-800 text-white p-2 rounded"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
        >
          <option value="all">All Matches</option>
          <option value="upcoming">Upcoming</option>
          <option value="past">Past</option>
        </select>

      </div>

      {/* =========================
          TABLE
      ========================= */}
      <div className="bg-gray-900 rounded-xl overflow-hidden">

        <table className="w-full text-left text-sm">
          <thead className="text-gray-400 border-b border-gray-800">
            <tr>
              <th className="p-3">Home</th>
              <th className="p-3">Away</th>
              <th className="p-3">Date/Time</th>
              <th className="p-3">Confidence</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((p) => (
              <tr
                key={p._id}
                onClick={() => setSelected(p)}
                className="border-b border-gray-800 hover:bg-gray-800 cursor-pointer"
              >
                <td className="p-3 text-white">{p.homeTeam}</td>
                <td className="p-3 text-white">{p.awayTeam}</td>

                {/* DATE */}
                <td className="p-3 text-gray-300">
                  {formatMatchTime(p.matchDate)}
                </td>

                {/* CONFIDENCE */}
                <td className="p-3 text-green-400">
                  {p.confidence}%
                </td>

                <td className="p-3 text-gray-400">
                  {p.accessType}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

      </div>

      {/* MODAL */}
      {selected && (
        <PredictionModal
          prediction={selected}
          onClose={() => setSelected(null)}
        />
      )}

    </div>
  );
}