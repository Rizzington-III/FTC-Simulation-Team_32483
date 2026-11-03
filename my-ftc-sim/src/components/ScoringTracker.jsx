import React, { useState } from 'react';

export default function ScoringTracker() {
  // Match state variables
  const [matchName, setMatchName] = useState('Practice Match #1');
  
  // Autonomous Scoring
  const [autoPark, setAutoPark] = useState(false);
  const [autoSamples, setAutoSamples] = useState(0);
  const [autoSpecimens, setAutoSpecimens] = useState(0);

  // Teleop Scoring
  const [teleSamples, setTeleSamples] = useState(0);
  const [teleSpecimens, setTeleSpecimens] = useState(0);

  // Endgame / Scoring Elements
  const [endgameHang, setEndgameHang] = useState('None'); // None, Low, High
  const [parked, setParked] = useState(false);
  const [penalties, setPenalties] = useState(0);

  // Score Calculations
  // (Adjust point values based on current FTC season manual rules)
  const autoScore = (autoPark ? 5 : 0) + (autoSamples * 4) + (autoSpecimens * 6);
  const teleScore = (teleSamples * 2) + (teleSpecimens * 4);
  const endgameScore = (endgameHang === 'High' ? 15 : endgameHang === 'Low' ? 5 : 0) + (parked ? 3 : 0);
  const penaltyPoints = penalties * 10;
  
  const totalScore = Math.max(0, autoScore + teleScore + endgameScore - penaltyPoints);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-slate-950 text-slate-100 min-h-screen">
      <div className="flex justify-between items-center mb-8 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-3xl font-bold text-yellow-400">FTC Match Scoring Tracker</h1>
          <p className="text-slate-400 text-sm mt-1">Track real-life test runs and match performance</p>
        </div>
        <input
          type="text"
          value={matchName}
          onChange={(e) => setMatchName(e.target.value)}
          className="bg-slate-900 border border-slate-700 px-4 py-2 rounded-lg text-yellow-400 font-semibold text-right"
        />
      </div>

      {/* Score Dashboard Hero Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-8 flex justify-around items-center text-center">
        <div>
          <div className="text-slate-400 text-xs uppercase tracking-wider">Autonomous</div>
          <div className="text-2xl font-bold text-emerald-400">{autoScore} pts</div>
        </div>
        <div className="text-slate-600 text-2xl">+</div>
        <div>
          <div className="text-slate-400 text-xs uppercase tracking-wider">TeleOp</div>
          <div className="text-2xl font-bold text-sky-400">{teleScore} pts</div>
        </div>
        <div className="text-slate-600 text-2xl">+</div>
        <div>
          <div className="text-slate-400 text-xs uppercase tracking-wider">Endgame</div>
          <div className="text-2xl font-bold text-indigo-400">{endgameScore} pts</div>
        </div>
        <div className="text-slate-600 text-2xl">-</div>
        <div>
          <div className="text-slate-400 text-xs uppercase tracking-wider">Penalties</div>
          <div className="text-2xl font-bold text-rose-500">{penaltyPoints} pts</div>
        </div>
        <div className="border-l border-slate-800 pl-8">
          <div className="text-slate-400 text-xs uppercase tracking-wider font-semibold">Total Score</div>
          <div className="text-4xl font-extrabold text-yellow-400">{totalScore}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Autonomous Section */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-4">
          <h2 className="text-lg font-bold text-emerald-400 border-b border-slate-800 pb-2">Autonomous Period</h2>
          
          <label className="flex items-center justify-between cursor-pointer">
            <span className="text-sm text-slate-300">Robot Parked</span>
            <input
              type="checkbox"
              checked={autoPark}
              onChange={(e) => setAutoPark(e.target.checked)}
              className="w-5 h-5 accent-emerald-500 rounded"
            />
          </label>

          <div>
            <label className="block text-sm text-slate-300 mb-1">Samples Scored: {autoSamples}</label>
            <div className="flex gap-2">
              <button onClick={() => setAutoSamples(Math.max(0, autoSamples - 1))} className="px-3 py-1 bg-slate-800 hover:bg-slate-700 rounded">-</button>
              <button onClick={() => setAutoSamples(autoSamples + 1)} className="flex-1 bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 rounded font-bold">+ Add</button>
            </div>
          </div>

          <div>
            <label className="block text-sm text-slate-300 mb-1">Specimens Scored: {autoSpecimens}</label>
            <div className="flex gap-2">
              <button onClick={() => setAutoSpecimens(Math.max(0, autoSpecimens - 1))} className="px-3 py-1 bg-slate-800 hover:bg-slate-700 rounded">-</button>
              <button onClick={() => setAutoSpecimens(autoSpecimens + 1)} className="flex-1 bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 rounded font-bold">+ Add</button>
            </div>
          </div>
        </div>

        {/* TeleOp Section */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-4">
          <h2 className="text-lg font-bold text-sky-400 border-b border-slate-800 pb-2">TeleOp Period</h2>

          <div>
            <label className="block text-sm text-slate-300 mb-1">Samples Scored: {teleSamples}</label>
            <div className="flex gap-2">
              <button onClick={() => setTeleSamples(Math.max(0, teleSamples - 1))} className="px-3 py-1 bg-slate-800 hover:bg-slate-700 rounded">-</button>
              <button onClick={() => setTeleSamples(teleSamples + 1)} className="flex-1 bg-sky-500/20 text-sky-400 hover:bg-sky-500/30 rounded font-bold">+ Add</button>
            </div>
          </div>

          <div>
            <label className="block text-sm text-slate-300 mb-1">Specimens Scored: {teleSpecimens}</label>
            <div className="flex gap-2">
              <button onClick={() => setTeleSpecimens(Math.max(0, teleSpecimens - 1))} className="px-3 py-1 bg-slate-800 hover:bg-slate-700 rounded">-</button>
              <button onClick={() => setTeleSpecimens(teleSpecimens + 1)} className="flex-1 bg-sky-500/20 text-sky-400 hover:bg-sky-500/30 rounded font-bold">+ Add</button>
            </div>
          </div>
        </div>

        {/* Endgame & Penalties */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-4">
          <h2 className="text-lg font-bold text-indigo-400 border-b border-slate-800 pb-2">Endgame & Penalties</h2>

          <div>
            <label className="block text-sm text-slate-300 mb-1">Robot Hang</label>
            <select
              value={endgameHang}
              onChange={(e) => setEndgameHang(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-slate-200 text-sm"
            >
              <option value="None">None (0 pts)</option>
              <option value="Low">Low Bar / Hang (5 pts)</option>
              <option value="High">High Hang / Ascent (15 pts)</option>
            </select>
          </div>

          <label className="flex items-center justify-between cursor-pointer pt-2">
            <span className="text-sm text-slate-300">Parked in Observation/Submersible</span>
            <input
              type="checkbox"
              checked={parked}
              onChange={(e) => setParked(e.target.checked)}
              className="w-5 h-5 accent-indigo-500 rounded"
            />
          </label>

          <div className="pt-2">
            <label className="block text-sm text-slate-300 mb-1">Penalties Incurred: {penalties}</label>
            <div className="flex gap-2">
              <button onClick={() => setPenalties(Math.max(0, penalties - 1))} className="px-3 py-1 bg-slate-800 hover:bg-slate-700 rounded">-</button>
              <button onClick={() => setPenalties(penalties + 1)} className="flex-1 bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 rounded font-bold">+ Penalty</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}