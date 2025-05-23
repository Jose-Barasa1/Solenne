'use client';

import { Dialog } from '@headlessui/react';
import { motion } from 'framer-motion';
import { useState } from 'react';

export default function OnboardingWizard({ onFinish }) {
  const [step, setStep] = useState(1);

  return (
    <Dialog open={true} onClose={() => {}}>
      <div className="fixed inset-0 bg-black/70 backdrop-blur-lg z-50 flex items-center justify-center p-6">
        <motion.div
          className="bg-gradient-to-br from-purple-800 to-indigo-900 p-8 rounded-3xl shadow-2xl max-w-lg text-white text-center"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          {step === 1 && (
            <>
              <h2 className="text-2xl font-bold mb-4">Welcome to Solenne ✨</h2>
              <p className="text-purple-200 mb-6">Let’s personalize your journey.</p>
              <button
                onClick={() => setStep(2)}
                className="bg-purple-500 px-6 py-2 rounded-full shadow hover:bg-purple-600 transition"
              >
                Start
              </button>
            </>
          )}
          {step === 2 && (
            <>
              <h2 className="text-xl font-semibold mb-3">What do you love most?</h2>
              <div className="flex justify-center gap-6">
                <button onClick={() => { setStep(3); playChime(); }} className="bg-purple-400 px-4 py-2 rounded-full hover:bg-purple-500">Art</button>
                <button onClick={() => { setStep(3); playChime(); }} className="bg-purple-400 px-4 py-2 rounded-full hover:bg-purple-500">Jewelry</button>
              </div>
            </>
          )}
          {step === 3 && (
            <>
              <h2 className="text-xl font-semibold mb-3">All set! ✨</h2>
              <p className="text-purple-300 mb-4">Explore glowing treasures just for you.</p>
              <button
                onClick={() => { onFinish(); playChime(); }}
                className="bg-purple-600 px-6 py-2 rounded-full hover:bg-purple-700"
              >
                Enter Crystal Market
              </button>
            </>
          )}
        </motion.div>
      </div>
    </Dialog>
  );
}

function playChime() {
  const audio = new Audio('/chime.mp3');
  audio.play();
}