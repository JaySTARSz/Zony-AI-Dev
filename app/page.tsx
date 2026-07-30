"use client";

import { useState } from "react";
import ScriptGenerator from "./components/ScriptGenerator";

export default function Home() {
  const [accessCode, setAccessCode] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">("monthly");

  const handleUnlock = () => {
    if (accessCode.trim()) {
      setIsUnlocked(true);
    }
  };

  // Plan IDs
  const gameDevMonthly = "plan_eWp92DiTfveGr";
  const gameDevYearly = "plan_f30vMIUPzsgdZ";
  const videoGenMonthly = "plan_CUwx7fcJPZvJa";
  const videoGenYearly = "plan_3RhHpr6XvXgDU";

  const gameDevPrice = billingPeriod === "monthly" ? "$29.99/month" : "$200.00/year";
  const videoGenPrice = billingPeriod === "monthly" ? "$29.99/month" : "$200.00/year";

  const gameDevPlanId = billingPeriod === "monthly" ? gameDevMonthly : gameDevYearly;
  const videoGenPlanId = billingPeriod === "monthly" ? videoGenMonthly : videoGenYearly;

  if (isUnlocked) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-black p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">Zony AI</h1>
            <p className="text-gray-300">Generator unlocked</p>
          </div>
          <ScriptGenerator accessCode={accessCode} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-black p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">Zony AI</h1>
          <p className="text-xl text-gray-300">Game Dev & Video Generation Tools</p>
        </div>

        <div className="flex justify-center mb-12 gap-4">
          <button
            onClick={() => setBillingPeriod("monthly")}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              billingPeriod === "monthly"
                ? "bg-blue-600 text-white"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            Monthly Billing
          </button>
          <button
            onClick={() => setBillingPeriod("yearly")}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              billingPeriod === "yearly"
                ? "bg-purple-600 text-white"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            Yearly Billing
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-gray-800 rounded-lg p-8 border border-gray-700 hover:border-blue-500 transition">
            <h2 className="text-2xl font-bold text-white mb-2">🎮 Game Dev Code</h2>
            <p className="text-gray-300 mb-6">
              Generate production-ready game development code powered by Groq AI
            </p>
            <div className="mb-6">
              <p className="text-3xl font-bold text-blue-400">{gameDevPrice}</p>
            </div>
            <a
              href={`https://whop.com/checkout/${gameDevPlanId}/`}
              className="w-full block text-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition"
            >
              Purchase Now
            </a>
          </div>

          <div className="bg-gray-800 rounded-lg p-8 border border-gray-700 hover:border-purple-500 transition">
            <h2 className="text-2xl font-bold text-white mb-2">🎬 Video Generation</h2>
            <p className="text-gray-300 mb-6">
              Create video generation scripts using Hugging Face models
            </p>
            <div className="mb-6">
              <p className="text-3xl font-bold text-purple-400">{videoGenPrice}</p>
            </div>
            <a
              href={`https://whop.com/checkout/${videoGenPlanId}/`}
              className="w-full block text-center bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg transition"
            >
              Purchase Now
            </a>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-8 border border-gray-700 max-w-md mx-auto">
          <h3 className="text-xl font-bold text-white mb-4">Already have an access code?</h3>
          <p className="text-gray-300 mb-4">Enter the code you received after purchase</p>
          <div className="flex gap-2">
            <input
              type="text"
              value={accessCode}
              onChange={(e) => setAccessCode(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleUnlock()}
              placeholder="Enter access code..."
              className="flex-1 px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleUnlock}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg transition"
            >
              Unlock
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
