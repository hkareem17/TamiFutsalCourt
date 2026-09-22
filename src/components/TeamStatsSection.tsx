import React, { useState } from 'react';
import { useBooking } from '../context/BookingContext';
import {
  Trophy,
  Medal,
  Award,
  Plus,
  Users,
  CheckCircle,
  TrendingUp,
  Shield,
  Flame,
  Search,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

export const TeamStatsSection: React.FC = () => {
  const { teamStats, matchScores, registerTeam, addMatchScore } = useBooking();

  const [searchQuery, setSearchQuery] = useState('');
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showLogMatchModal, setShowLogMatchModal] = useState(false);

  // Register Team form
  const [regTeamName, setRegTeamName] = useState('');
  const [regCaptain, setRegCaptain] = useState('');
  const [regSuccess, setRegSuccess] = useState(false);

  // Log Match form
  const [matchTeamA, setMatchTeamA] = useState(teamStats[0]?.teamName || '');
  const [matchTeamB, setMatchTeamB] = useState(teamStats[1]?.teamName || '');
  const [scoreA, setScoreA] = useState(3);
  const [scoreB, setScoreB] = useState(2);
  const [pitchName, setPitchName] = useState('Tami Futsal Ground');
  const [mvp, setMvp] = useState('');

  const filteredTeams = teamStats.filter((t) =>
    t.teamName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.captain.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRegisterTeamSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regTeamName.trim() || !regCaptain.trim()) return;
    registerTeam(regTeamName.trim(), regCaptain.trim());
    setRegSuccess(true);
    setTimeout(() => {
      setRegSuccess(false);
      setShowRegisterModal(false);
      setRegTeamName('');
      setRegCaptain('');
    }, 1200);
  };

  const handleLogMatchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (matchTeamA === matchTeamB) {
      alert('Please select two distinct teams.');
      return;
    }
    addMatchScore({
      date: '2026-09-22',
      teamA: matchTeamA,
      teamB: matchTeamB,
      scoreA: Number(scoreA),
      scoreB: Number(scoreB),
      pitch: pitchName,
      mvp: mvp.trim() || `${matchTeamA} Captain`,
    });
    setShowLogMatchModal(false);
    setMvp('');
  };

  return (
    <section id="stats-section" className="py-10 bg-neutral-950 text-neutral-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-neutral-800 pb-6">
          <div>
            <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs uppercase tracking-wider mb-1">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>Turf League & Match Records</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Tami Futsal Ground Team Statistics
            </h2>
            <p className="text-sm text-neutral-400 mt-1">
              Live standings, goal differences, recent match results, and win streaks on our twin pitches.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <button
              onClick={() => setShowRegisterModal(true)}
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs flex items-center gap-1.5 shadow-md transition-all active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Register Team</span>
            </button>
            <button
              onClick={() => setShowLogMatchModal(true)}
              className="px-4 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border border-neutral-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Award className="w-4 h-4 text-amber-400" />
              <span>Log Match Result</span>
            </button>
          </div>
        </div>

        {/* Top 3 Podium Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {teamStats.slice(0, 3).map((team, idx) => (
            <div
              key={team.id}
              className={`rounded-2xl p-5 border relative overflow-hidden flex flex-col justify-between ${
                idx === 0
                  ? 'bg-gradient-to-b from-amber-950/30 to-neutral-900 border-amber-500/40 shadow-lg shadow-amber-500/5'
                  : idx === 1
                  ? 'bg-gradient-to-b from-neutral-800/30 to-neutral-900 border-neutral-700'
                  : 'bg-gradient-to-b from-orange-950/20 to-neutral-900 border-orange-800/30'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                        idx === 0
                          ? 'bg-amber-400 text-neutral-950'
                          : idx === 1
                          ? 'bg-neutral-300 text-neutral-950'
                          : 'bg-amber-700 text-white'
                      }`}
                    >
                      {idx + 1}
                    </span>
                    <span className="text-xs uppercase tracking-wider text-neutral-400 font-semibold">
                      {idx === 0 ? 'Leader' : idx === 1 ? 'Runner Up' : '3rd Place'}
                    </span>
                  </div>
                  <h3 className="text-lg font-black text-white mt-1.5">{team.teamName}</h3>
                  <p className="text-xs text-neutral-400">Capt: {team.captain}</p>
                </div>

                <div className="text-right">
                  <span className="text-2xl font-black text-amber-400 font-mono">
                    {team.points}
                  </span>
                  <p className="text-[10px] text-neutral-500 uppercase font-semibold">Points</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-4 mt-4 border-t border-neutral-800/80 text-center text-xs">
                <div>
                  <p className="text-neutral-500 text-[10px]">Played</p>
                  <p className="font-bold text-white font-mono">{team.played}</p>
                </div>
                <div>
                  <p className="text-neutral-500 text-[10px]">Win Rate</p>
                  <p className="font-bold text-emerald-400 font-mono">{team.winRate}%</p>
                </div>
                <div>
                  <p className="text-neutral-500 text-[10px]">GD</p>
                  <p className="font-bold text-white font-mono">+{team.goalDifference}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Leaderboard Table */}
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h3 className="text-base font-extrabold text-white flex items-center gap-2">
              <Trophy className="w-4 h-4 text-emerald-400" />
              <span>Turf Championship Standings</span>
            </h3>

            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
              <input
                type="text"
                placeholder="Search team or captain..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-neutral-800 text-neutral-400 font-medium">
                  <th className="py-2.5 px-3">Rank</th>
                  <th className="py-2.5 px-3">Team</th>
                  <th className="py-2.5 px-3">Captain</th>
                  <th className="py-2.5 px-3 text-center">P</th>
                  <th className="py-2.5 px-3 text-center">W</th>
                  <th className="py-2.5 px-3 text-center">D</th>
                  <th className="py-2.5 px-3 text-center">L</th>
                  <th className="py-2.5 px-3 text-center">GF</th>
                  <th className="py-2.5 px-3 text-center">GA</th>
                  <th className="py-2.5 px-3 text-center">GD</th>
                  <th className="py-2.5 px-3 text-center font-bold text-white">Pts</th>
                  <th className="py-2.5 px-3 text-center">Win%</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/60 font-mono">
                {filteredTeams.map((team, idx) => (
                  <tr key={team.id} className="hover:bg-neutral-800/30 transition-colors">
                    <td className="py-3 px-3">
                      <span
                        className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                          idx === 0
                            ? 'bg-amber-500/20 text-amber-300'
                            : idx === 1
                            ? 'bg-neutral-700/50 text-neutral-200'
                            : idx === 2
                            ? 'bg-orange-900/30 text-orange-300'
                            : 'text-neutral-400'
                        }`}
                      >
                        {team.rank}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-sans font-extrabold text-white">
                      {team.teamName}
                    </td>
                    <td className="py-3 px-3 font-sans text-neutral-300">
                      {team.captain}
                    </td>
                    <td className="py-3 px-3 text-center text-neutral-300">{team.played}</td>
                    <td className="py-3 px-3 text-center text-emerald-400 font-bold">{team.won}</td>
                    <td className="py-3 px-3 text-center text-neutral-400">{team.drawn}</td>
                    <td className="py-3 px-3 text-center text-rose-400">{team.lost}</td>
                    <td className="py-3 px-3 text-center text-neutral-300">{team.goalsFor}</td>
                    <td className="py-3 px-3 text-center text-neutral-400">{team.goalsAgainst}</td>
                    <td className="py-3 px-3 text-center font-bold">
                      {team.goalDifference > 0 ? `+${team.goalDifference}` : team.goalDifference}
                    </td>
                    <td className="py-3 px-3 text-center font-black text-amber-400 text-sm">
                      {team.points}
                    </td>
                    <td className="py-3 px-3 text-center text-neutral-300">
                      {team.winRate}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Matches Played at Tami Futsal Ground */}
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-extrabold text-white flex items-center gap-2">
              <Flame className="w-4 h-4 text-orange-400" />
              <span>Recent Matches Played at Tami Futsal Ground</span>
            </h3>
            <span className="text-xs text-neutral-400">Match score logs</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {matchScores.map((m) => (
              <div
                key={m.id}
                className="p-4 rounded-xl bg-neutral-950 border border-neutral-800/80 flex items-center justify-between"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs text-neutral-400">
                    <span>{m.date}</span>
                    <span>•</span>
                    <span className="text-emerald-400">{m.pitch}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-extrabold text-white text-sm">{m.teamA}</span>
                    <span className="px-2 py-0.5 rounded-md bg-neutral-800 font-mono font-black text-emerald-400 text-sm">
                      {m.scoreA} - {m.scoreB}
                    </span>
                    <span className="font-extrabold text-white text-sm">{m.teamB}</span>
                  </div>
                  <p className="text-[11px] text-neutral-500">MVP: {m.mvp}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Register Team Modal */}
      {showRegisterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-neutral-900 border border-neutral-800 p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-1">Register Team for Turf League</h3>
            <p className="text-xs text-neutral-400 mb-4">
              Add your squad to the Tami Futsal Ground official rankings.
            </p>

            {regSuccess ? (
              <div className="py-6 text-center space-y-2 text-emerald-400">
                <CheckCircle className="w-12 h-12 mx-auto animate-bounce" />
                <p className="font-bold text-sm">Team Registered Successfully!</p>
              </div>
            ) : (
              <form onSubmit={handleRegisterTeamSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Team Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Islamabad Titans"
                    value={regTeamName}
                    onChange={(e) => setRegTeamName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Captain Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Bilal Ahmed"
                    value={regCaptain}
                    onChange={(e) => setRegCaptain(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowRegisterModal(false)}
                    className="flex-1 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs"
                  >
                    Confirm Registration
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Log Match Modal */}
      {showLogMatchModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-neutral-900 border border-neutral-800 p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-1">Log Match Scoreline</h3>
            <p className="text-xs text-neutral-400 mb-4">
              Record a match result played at Tami Futsal Ground to update the table.
            </p>

            <form onSubmit={handleLogMatchSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Team A
                  </label>
                  <select
                    value={matchTeamA}
                    onChange={(e) => setMatchTeamA(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs"
                  >
                    {teamStats.map((t) => (
                      <option key={t.id} value={t.teamName}>
                        {t.teamName}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Team B
                  </label>
                  <select
                    value={matchTeamB}
                    onChange={(e) => setMatchTeamB(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs"
                  >
                    {teamStats.map((t) => (
                      <option key={t.id} value={t.teamName}>
                        {t.teamName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Score Team A
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={scoreA}
                    onChange={(e) => setScoreA(parseInt(e.target.value, 10))}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-sm font-mono text-center"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Score Team B
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={scoreB}
                    onChange={(e) => setScoreB(parseInt(e.target.value, 10))}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-sm font-mono text-center"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">Turf Arena</label>
                <select
                  value={pitchName}
                  onChange={(e) => setPitchName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs"
                >
                  <option value="Tami Futsal Ground">Tami Futsal Ground (Gahkuch Khari)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Player of the Match (MVP)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Tariq (2 Goals)"
                  value={mvp}
                  onChange={(e) => setMvp(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowLogMatchModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs"
                >
                  Save Result
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
