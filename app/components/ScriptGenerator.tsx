'use client';

import { useState } from 'react';

interface ScriptGeneratorProps {
  accessCode: string;
}

export default function ScriptGenerator({ accessCode }: ScriptGeneratorProps) {
  const [generatorType, setGeneratorType] = useState<'game' | 'video'>('game');
  const [prompt, setPrompt] = useState('');
  const [generatedScript, setGeneratedScript] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt');
      return;
    }

    setLoading(true);
    setError('');
    setGeneratedScript('');

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: generatorType,
          prompt,
          accessCode,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Generation failed');
      }

      const data = await response.json();
      setGeneratedScript(data.script);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedScript);
    alert('Script copied to clipboard!');
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([generatedScript], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${generatorType}-script-${Date.now()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Zony AI Generator</h1>
          <p className="text-gray-300">Access Code: <span className="font-mono text-green-400">{accessCode}</span></p>
        </div>

        <div className="bg-slate-700 rounded-lg p-6 mb-6 border border-slate-600">
          <h2 className="text-lg font-bold text-white mb-4">Select Generator</h2>
          <div className="flex gap-4">
            <button
              onClick={() => setGeneratorType('game')}
              className={`px-6 py-2 rounded font-bold transition ${
                generatorType === 'game'
                  ? 'bg-green-600 text-white'
                  : 'bg-slate-600 text-gray-300 hover:bg-slate-500'
              }`}
            >
              Game Dev Code
            </button>
            <button
              onClick={() => setGeneratorType('video')}
              className={`px-6 py-2 rounded font-bold transition ${
                generatorType === 'video'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-600 text-gray-300 hover:bg-slate-500'
              }`}
            >
              Video Generation
            </button>
          </div>
        </div>

        <div className="bg-slate-700 rounded-lg p-6 mb-6 border border-slate-600">
          <label className="block text-white font-bold mb-2">Enter Your Prompt</label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe what you want..."
            className="w-full px-4 py-3 rounded bg-slate-600 text-white placeholder-gray-400 border border-slate-500 h-24 resize-none"
          />
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="mt-4 w-full bg-purple-600 hover:bg-purple-700 disabled:bg-slate-500 text-white font-bold py-2 px-4 rounded transition"
          >
            {loading ? 'Generating...' : 'Generate Script'}
          </button>
        </div>

        {error && (
          <div className="bg-red-900 text-red-200 rounded-lg p-4 mb-6 border border-red-700">
            {error}
          </div>
        )}

        {generatedScript && (
          <div className="bg-slate-700 rounded-lg p-6 border border-slate-600">
            <h3 className="text-lg font-bold text-white mb-4">Generated Script</h3>
            <pre className="bg-slate-800 p-4 rounded text-gray-100 text-sm overflow-x-auto mb-4 max-h-96">
              {generatedScript}
            </pre>
            <div className="flex gap-3">
              <button
                onClick={handleCopy}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition"
              >
                Copy to Clipboard
              </button>
              <button
                onClick={handleDownload}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition"
              >
                Download
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
