import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GenerateQuizTab from './tabs/GenerateQuizTab';
import HistoryTab from './tabs/HistoryTab';
import StatsDashboard from './components/StatsDashboard';
import ThemeToggle from './components/ThemeToggle';
import { useTheme } from './contexts/ThemeContext';
import { wakeupBackend } from './utils/wakeupBackend';

// Leaderboard demo data
const leaderboardData = [
  { id: 1, name: 'Alex Johnson', score: 95, quizzes: 12 },
  { id: 2, name: 'Sam Wilson', score: 87, quizzes: 8 },
  { id: 3, name: 'Taylor Kim', score: 82, quizzes: 15 },
  { id: 4, name: 'Jordan Smith', score: 78, quizzes: 6 },
  { id: 5, name: 'Casey Brown', score: 75, quizzes: 10 },
];

function App() {
  const [activeTab, setActiveTab] = useState('generate');
  const [status, setStatus] = useState("Loading...");
  const { theme } = useTheme();

  // Wake up backend when app loads
  useEffect(() => {
    const timer = setTimeout(() => {
      setStatus("Waking up backend... this may take 20–30 seconds ⏳");
    }, 5000);
    
    wakeupBackend().then(() => {
      clearTimeout(timer);
      setStatus("Ready!");
      // Clear the status message after a short delay
      setTimeout(() => setStatus(""), 3000);
    });
    
    return () => clearTimeout(timer);
  }, []);

  const LeaderboardTab = useCallback(() => (
    <div className="glass-panel fade-in p-6 md:p-8 rounded-2xl border border-base-300 shadow-lg bg-gradient-to-br from-base-100/80 to-base-200/80 backdrop-blur-md">
      <h2 className="text-3xl font-bold text-gradient mb-6 text-center">🏆 Leaderboard</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm md:text-base">
          <thead className="bg-base-200/70 rounded-t-lg">
            <tr>
              <th className="px-4 py-3 font-semibold text-primary rounded-tl-lg">Rank</th>
              <th className="px-4 py-3 font-semibold text-primary">Player</th>
              <th className="px-4 py-3 font-semibold text-primary">Score</th>
              <th className="px-4 py-3 font-semibold text-primary rounded-tr-lg">Quizzes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-base-300">
            {leaderboardData.map((p, i) => (
              <tr
                key={p.id}
                className={`transition-all duration-300 ${
                  i < 3
                    ? 'bg-gradient-to-r from-primary/10 to-secondary/10'
                    : 'hover:bg-base-200/50'
                }`}
              >
                <td className="px-4 py-3 font-semibold text-primary">{i + 1}</td>
                <td className="px-4 py-3 flex items-center gap-3">
                  <div className="bg-primary/20 text-primary rounded-full h-8 w-8 flex items-center justify-center font-bold">
                    {p.name.split(' ').map((n) => n[0]).join('')}
                  </div>
                  <span className="font-medium">{p.name}</span>
                </td>
                <td className="px-4 py-3 font-semibold text-secondary">{p.score}%</td>
                <td className="px-4 py-3 text-base-content/80">{p.quizzes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  ), []);

  // Tab configuration
  const tabs = [
    { id: 'generate', label: 'Generate Quiz', component: GenerateQuizTab },
    { id: 'history', label: 'Quiz History', component: HistoryTab },
    { id: 'leaderboard', label: 'Leaderboard', component: LeaderboardTab },
    { id: 'stats', label: 'Stats', component: StatsDashboard },
  ];

  const ActiveTabComponent = tabs.find(tab => tab.id === activeTab)?.component || GenerateQuizTab;

  return (
    <div
      className={`min-h-screen transition-all duration-500 ${
        theme === 'bright' ? 'theme-bright' : 'theme-darkmagic'
      }`}
    >
      {/* HEADER */}
      <header className="relative bg-gradient-to-r from-primary via-secondary to-accent shadow-xl text-white rounded-b-3xl">
        <div className="absolute top-5 right-5 z-10">
          <ThemeToggle />
        </div>
        <div className="max-w-6xl mx-auto text-center py-12 px-4 sm:px-6">
          {/* Enhanced heading with darker, more prominent color scheme */}
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-5xl font-extrabold drop-shadow-lg text-white dark:text-gray-900"
          >
            AI Wiki Quiz Generator
          </motion.h1>
          <p className="mt-3 text-lg text-white/90 max-w-2xl mx-auto font-light">
            Instantly transform Wikipedia articles into engaging quizzes powered by AI
          </p>
          {/* Status message for backend wake-up */}
          {status && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 text-sm font-medium bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 inline-block"
            >
              {status}
            </motion.div>
          )}
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="relative z-10 -mt-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {/* TAB NAVIGATION */}
          <div className="flex justify-center flex-wrap gap-3 mb-10 fade-in">
            {tabs.map((tab) => (
              <motion.button
                key={tab.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 rounded-full font-medium text-sm md:text-base shadow-lg transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-xl'
                    : 'bg-white/60 dark:bg-slate-800/60 text-slate-700 dark:text-gray-200 hover:bg-white/80 dark:hover:bg-slate-700/80 backdrop-blur-md'
                }`}
              >
                {tab.label}
              </motion.button>
            ))}
          </div>

          {/* TAB CONTENT */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="glass-panel p-6 md:p-8 fade-in rounded-2xl border border-base-300 shadow-lg bg-gradient-to-br from-base-100/80 to-base-200/80 backdrop-blur-md"
          >
            <AnimatePresence mode="wait">
              <ActiveTabComponent />
            </AnimatePresence>
          </motion.div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="text-center py-8 text-sm text-gray-600 dark:text-gray-400 border-t border-white/20 mt-8 bg-base-100/30 dark:bg-base-200/30 backdrop-blur-sm">
        <p>
          Built with <span className="text-gradient font-semibold">💜 AI + React</span>
        </p>
        <p className="opacity-70 mt-1">© 2025 AI Wiki Quiz. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;