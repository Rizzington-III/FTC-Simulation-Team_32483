import React, { useState } from 'react';
import SimulatorApp from './components/SimulatorApp';
import PedroPathStudio from './components/PedroPathStudio';
import ScoringTracker from './components/ScoringTracker';
import AIChatbot from './components/AIChatbot';

export default function App() {
  const [activeTab, setActiveTab] = useState('3d-sim');

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 font-sans overflow-hidden">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between p-4">
        <div>
          {/* Logo / Brand */}
          <div className="flex items-center gap-3 px-3 py-4 mb-6 border-b border-slate-800">
            <div className="w-8 h-8 rounded-lg bg-yellow-400 flex items-center justify-center font-bold text-slate-950">
              FTC
            </div>
            <div>
              <h1 className="font-bold text-sm tracking-wide text-yellow-400">ROBOTICS SUITE</h1>
              <p className="text-xs text-slate-400">Simulation & Strategy</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            <button
              onClick={() => setActiveTab('3d-sim')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                activeTab === '3d-sim'
                  ? 'bg-yellow-400 text-slate-950 font-semibold shadow-lg shadow-yellow-400/10'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              🎮 3D Robot Simulator
            </button>

            <button
              onClick={() => setActiveTab('path-studio')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                activeTab === 'path-studio'
                  ? 'bg-yellow-400 text-slate-950 font-semibold shadow-lg shadow-yellow-400/10'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              📈 2D Path Studio
            </button>

            <button
              onClick={() => setActiveTab('scoring')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                activeTab === 'scoring'
                  ? 'bg-yellow-400 text-slate-950 font-semibold shadow-lg shadow-yellow-400/10'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              🏆 Match Scoring Tracker
            </button>

            <button
              onClick={() => setActiveTab('chatbot')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                activeTab === 'chatbot'
                  ? 'bg-yellow-400 text-slate-950 font-semibold shadow-lg shadow-yellow-400/10'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              🤖 AI Code Assistant
            </button>
          </nav>
        </div>

        {/* Footer Status */}
        <div className="p-3 bg-slate-950/50 rounded-xl border border-slate-800/80 text-xs text-slate-400">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-semibold text-slate-300">Oxlint Active</span>
          </div>
          Ready for FTC Match Practice
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto bg-slate-950">
        {activeTab === '3d-sim' && <SimulatorApp />}
        {activeTab === 'path-studio' && <PedroPathStudio />}
        {activeTab === 'scoring' && <ScoringTracker />}
        {activeTab === 'chatbot' && <AIChatbot />}
      </main>
    </div>
  );
}