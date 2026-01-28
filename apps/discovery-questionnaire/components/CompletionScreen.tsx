"use client";

import { QuestionnaireResponse } from "@/types";
import { generateResponseHTML } from "@/lib/htmlGenerator";
import { useRouter } from "next/navigation";

interface CompletionScreenProps {
  response: QuestionnaireResponse;
}

export function CompletionScreen({ response }: CompletionScreenProps) {
  const router = useRouter();

  const handleExport = () => {
    const htmlContent = generateResponseHTML(response);
    const blob = new Blob([htmlContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `erp-questionnaire-${new Date().toISOString().split("T")[0]}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    const htmlContent = generateResponseHTML(response);
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      printWindow.onload = () => {
        printWindow.print();
      };
    }
  };

  const handleStartOver = () => {
    if (confirm("Are you sure you want to start over? This will delete all your current responses.")) {
      router.push("/");
    }
  };

  return (
    <div className="min-h-screen bg-neutral-bg flex items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-2xl shadow-elevated overflow-hidden">
          <div className="bg-gradient-to-r from-green-600 to-green-700 p-8 sm:p-10 text-center">
            <div className="mb-4">
              <svg
                className="w-20 h-20 mx-auto text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
              Thank You!
            </h1>
            <p className="text-white/90 text-lg">
              Your questionnaire has been completed successfully.
            </p>
          </div>

          <div className="p-8 sm:p-10">
            <div className="space-y-6">
              <div className="bg-green-50 border-l-4 border-green-500 rounded-r-xl p-5">
                <p className="text-green-800 font-medium">
                  <strong>Completion Confirmed</strong>
                </p>
                <p className="text-green-700 mt-2 text-sm">
                  {response.metadata.userName
                    ? `Thank you, ${response.metadata.userName}, for completing the ERP Discovery Questionnaire.`
                    : "Thank you for completing the ERP Discovery Questionnaire."}
                </p>
              </div>

              <div className="bg-brand-purple/5 border-l-4 border-brand-purple rounded-r-xl p-5">
                <p className="text-brand-purple font-semibold mb-2">
                  Export Your Results
                </p>
                <p className="text-neutral-text text-sm mb-4">
                  Download a printable HTML summary of all your responses. This file can be saved, printed, or shared.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleExport}
                    className="flex-1 bg-accent-coral text-white py-3 px-6 rounded-xl font-semibold hover:bg-accent-coralDark transition-all duration-200 shadow-card hover:shadow-card-hover focus-visible:ring-2 focus-visible:ring-accent-coral focus-visible:ring-offset-2"
                  >
                    Download HTML
                  </button>
                  <button
                    onClick={handlePrint}
                    className="flex-1 border-2 border-brand-purple text-brand-purple py-3 px-6 rounded-xl font-semibold hover:bg-brand-purple hover:text-white transition-all duration-200 focus-visible:ring-2 focus-visible:ring-brand-purple focus-visible:ring-offset-2"
                  >
                    Print Summary
                  </button>
                </div>
              </div>

              <div className="bg-blue-50 border-l-4 border-blue-500 rounded-r-xl p-5">
                <p className="text-blue-800 font-semibold mb-2">
                  Important Notes
                </p>
                <ul className="text-blue-700 text-sm space-y-2 list-disc list-inside">
                  <li>Your responses are stored locally in your browser</li>
                  <li>If you clear your browser data, your responses will be lost</li>
                  <li>Please export and save your results for your records</li>
                  <li>You can start a new questionnaire at any time</li>
                </ul>
              </div>

              <div className="pt-4 border-t border-neutral-border flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleStartOver}
                  className="flex-1 border-2 border-neutral-border text-neutral-text py-3 px-6 rounded-xl font-semibold hover:bg-neutral-bg transition-all duration-200 focus-visible:ring-2 focus-visible:ring-brand-purple focus-visible:ring-offset-2"
                >
                  Start New Questionnaire
                </button>
                <button
                  onClick={() => router.push("/")}
                  className="flex-1 border-2 border-brand-purple text-brand-purple py-3 px-6 rounded-xl font-semibold hover:bg-brand-purple hover:text-white transition-all duration-200 focus-visible:ring-2 focus-visible:ring-brand-purple focus-visible:ring-offset-2"
                >
                  Return Home
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
