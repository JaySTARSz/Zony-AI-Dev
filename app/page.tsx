'use client';

import { useState } from 'react';
import ScriptGenerator from './components/ScriptGenerator';

export default function Home() {
  const [accessCode, setAccessCode] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [codeInput, setCodeInput] = useState('');

  const handleAccessCode = () => {
    if (codeInput.trim()) {
      localStorage.setItem('zonyAccessCode', codeInput);
      setAccessCode(codeInput);
      setIsUnlocked(true);
      setCodeInput('');
    }
  };

  if (isUnlocked) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
        <ScriptGenerator accessCode={accessCode} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-2">Zony AI</h1>
          <p className="text-gray-300 text-lg">Game Dev & Video Generation Tools</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <div className="bg-slate-700 rounded-lg p-6 border border-slate-600">
            <h2 className="text-2xl font-bold text-white mb-2">Game Dev Code</h2>
            <p className="text-gray-300 mb-4">Generate production-ready game development code powered by Groq AI</p>
            <div className="mb-6">
              <span className="text-4xl font-bold text-green-400">$300</span>
              <span className="text-gray-400 ml-2">one-time</span>
            </div>
            <a
              href="https://whop.com/checkout/plan_TGrmhK6sLKi7V/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition"
            >
              Purchase Now
            </a>
          </div>

          <div className="bg-slate-700 rounded-lg p-6 border border-slate-600">
            <h2 className="text-2xl font-bold text-white mb-2">Video Generation</h2>
            <p className="text-gray-300 mb-4">Create video generation scripts using Hugging Face models</p>
            <div className="mb-6">
              <span className="text-4xl font-bold text-blue-400">$29.99</span>
              <span className="text-gray-400 ml-2">/month</span>
            </div>
            <a
              href="https://whop.com/checkout/plan_CUwx7fcJPZvJa/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition"
            >
              Subscribe Now
            </a>
          </div>
        </div>

        <div className="bg-slate-700 rounded-lg p-8 border border-slate-600">
          <h3 className="text-xl font-bold text-white mb-4">Already have an access code?</h3>
          <p className="text-gray-300 mb-4">Enter the code you received after purchase</p>
          <div className="flex gap-2">
            <input
              type="text"
              value={codeInput}
              onChange={(e) => setCodeInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAccessCode()}
              placeholder="Enter your access code"
              className="flex-1 px-4 py-2 rounded bg-slate-600 text-white placeholder-gray-400 border border-slate-500"
            />
            <button
              onClick={handleAccessCode}
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded transition"
            >
              Unlock
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
