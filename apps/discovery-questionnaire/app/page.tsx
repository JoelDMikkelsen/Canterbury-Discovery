"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getResponse } from "@/lib/localStorage";

export default function Home() {
  const router = useRouter();
  const [hasExistingData, setHasExistingData] = useState(false);

  useEffect(() => {
    const existing = getResponse();
    setHasExistingData(existing !== null);
  }, []);

  const handleStart = () => {
    router.push("/questionnaire");
  };

  return (
    <div className="min-h-screen bg-neutral-bg flex items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-2xl shadow-elevated overflow-hidden">
          <div className="bg-gradient-to-r from-brand-purple to-brand-purpleDark p-8 sm:p-10">
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
              ERP Discovery Questionnaire
            </h1>
            <div className="h-1 w-20 bg-accent-coral rounded-full"></div>
          </div>
          
          <div className="p-8 sm:p-10">
            <p className="text-lg text-neutral-text mb-8 leading-relaxed">
              This questionnaire is designed to gather context for evaluating ERP solutions.
              Your responses will help inform a balanced comparison between NetSuite and
              Microsoft Dynamics 365 Business Central.
            </p>

            <div className="bg-brand-purple/5 border-l-4 border-accent-coral rounded-r-xl p-5 mb-8">
              <p className="text-sm text-neutral-text font-medium">
                <strong className="text-brand-purple">Estimated completion time:</strong> 60-75 minutes
              </p>
              <p className="text-sm text-neutral-text mt-2">
                You can save your progress and return later. All responses are automatically saved to your browser.
              </p>
            </div>

            {hasExistingData && (
              <div className="bg-blue-50 border-l-4 border-blue-500 rounded-r-xl p-5 mb-8">
                <p className="text-sm text-blue-800 font-medium">
                  <strong>Resume Available</strong>
                </p>
                <p className="text-sm text-blue-700 mt-2">
                  We found saved progress. You can continue where you left off or start fresh.
                </p>
              </div>
            )}

            <button
              onClick={handleStart}
              className="w-full bg-accent-coral text-white py-4 px-8 rounded-xl font-semibold text-lg hover:bg-accent-coralDark transition-all duration-200 shadow-card hover:shadow-card-hover focus-visible:ring-2 focus-visible:ring-accent-coral focus-visible:ring-offset-2"
            >
              {hasExistingData ? "Continue Questionnaire" : "Start Questionnaire"}
            </button>

            <p className="text-xs text-neutral-muted mt-6 text-center">
              Your responses are stored locally in your browser. No data is sent to any server.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
