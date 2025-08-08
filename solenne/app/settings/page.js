'use client';

import { useEffect, useState } from 'react';
import { Sun, Moon, Settings as CogIcon, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Settings() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('theme');
    if (stored === 'dark') {
      document.documentElement.classList.add('dark');
      setDarkMode(true);
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    if (newMode) {
      localStorage.setItem('theme', 'dark');
      document.documentElement.classList.add('dark');
    } else {
      localStorage.setItem('theme', 'light');
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <div className="p-6 text-white">
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <CogIcon /> Settings
      </h2>
      <div className="bg-purple-900 p-4 rounded-lg shadow-lg flex justify-between items-center">
        <div className="flex items-center gap-4">
          {darkMode ? <Moon className="text-yellow-300" /> : <Sun className="text-yellow-500" />}
          <span>{darkMode ? 'Dark Mode' : 'Light Mode'}</span>
        </div>
        <button
          onClick={toggleDarkMode}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg shadow"
        >
          Toggle
        </button>
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mt-6 flex items-center gap-2 text-green-400"
      >
        <CheckCircle2 /> Preferences saved locally
      </motion.div>
    </div>
  );
}
