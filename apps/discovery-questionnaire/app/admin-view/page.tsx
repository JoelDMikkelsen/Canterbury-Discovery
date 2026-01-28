"use client";

import { useState, useEffect } from "react";
import { QuestionnaireResponse } from "@/types";
import { getResponse } from "@/lib/localStorage";
import { generateResponseHTML } from "@/lib/htmlGenerator";
import { sections } from "@/lib/questions";

// Simple password protection - change this to your desired password
const ADMIN_PASSWORD = "fusion5-admin-2024";

export default function AdminViewPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [localResponse, setLocalResponse] = useState<QuestionnaireResponse | null>(null);
  const [importedResponses, setImportedResponses] = useState<QuestionnaireResponse[]>([]);
  const [dbResponses, setDbResponses] = useState<QuestionnaireResponse[]>([]);
  const [selectedResponse, setSelectedResponse] = useState<QuestionnaireResponse | null>(null);
  const [viewMode, setViewMode] = useState<"list" | "detail">("list");
  const [isLoadingDb, setIsLoadingDb] = useState(false);
  const [dbError, setDbError] = useState("");

  useEffect(() => {
    // Check if already authenticated (stored in sessionStorage)
    const authStatus = sessionStorage.getItem("admin-authenticated");
    if (authStatus === "true") {
      setIsAuthenticated(true);
      loadLocalResponse();
    }
  }, []);

  const loadDbResponses = async () => {
    /**
     * IMPORTANT SECURITY NOTE
     * We intentionally DO NOT read from Supabase directly in the browser.
     *
     * Supabase anon SELECT is forbidden (RLS should block it).
     * Admin reads must go through a Netlify Function which uses SUPABASE_SERVICE_ROLE_KEY
     * server-side. That key must never be exposed to client code.
     */
    setIsLoadingDb(true);
    setDbError("");

    try {
      const res = await fetch("/.netlify/functions/getResponses", { method: "GET" });
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`Request failed: ${res.status} ${text}`);
      }
      const payload = (await res.json()) as { ok: boolean; data?: any[]; error?: string };
      if (!payload.ok) {
        throw new Error(payload.error || "Failed to load responses");
      }

      const rows = Array.isArray(payload.data) ? payload.data : [];
      // Our insert stores the full questionnaire response JSON inside response_data.
      const responses = rows
        .map((row: any) => row?.response_data)
        .filter(Boolean) as QuestionnaireResponse[];

      setDbResponses(responses);
      if (responses.length > 0 && !selectedResponse) {
        setSelectedResponse(responses[0]);
      }
    } catch (e: any) {
      setDbError(e?.message || "Failed to load responses");
    } finally {
      setIsLoadingDb(false);
    }
  };

  const loadLocalResponse = () => {
    const response = getResponse();
    setLocalResponse(response);
    if (response) {
      setSelectedResponse(response);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      sessionStorage.setItem("admin-authenticated", "true");
      setError("");
      loadLocalResponse();
    } else {
      setError("Incorrect password");
      setPassword("");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem("admin-authenticated");
    setPassword("");
    setLocalResponse(null);
    setImportedResponses([]);
    setSelectedResponse(null);
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const response = JSON.parse(content) as QuestionnaireResponse;
        
        // Validate it's a valid response
        if (response.id && response.sections && response.progress) {
          setImportedResponses((prev) => [...prev, response]);
          if (!selectedResponse) {
            setSelectedResponse(response);
          }
          setError("");
        } else {
          setError("Invalid response file format");
        }
      } catch (err) {
        setError("Failed to parse file. Please ensure it's a valid JSON file.");
        console.error("Import error:", err);
      }
    };
    reader.readAsText(file);
  };

  const handleExportSelected = () => {
    if (!selectedResponse) return;
    const htmlContent = generateResponseHTML(selectedResponse);
    const blob = new Blob([htmlContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `response-${selectedResponse.id}-${new Date().toISOString().split("T")[0]}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleExportJSON = (response: QuestionnaireResponse) => {
    const json = JSON.stringify(response, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `response-${response.id}-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const formatAnswer = (questionId: string, value: any, questionType: string): string => {
    if (value === null || value === undefined) {
      return "Not answered";
    }

    switch (questionType) {
      case "multiple-choice":
        const question = sections
          .flatMap((s) => s.questions)
          .find((q) => q.id === questionId);
        const option = question?.options?.find((opt) => opt.value === value);
        return option?.label || String(value);
      
      case "multiple-select":
        if (Array.isArray(value)) {
          const question2 = sections
            .flatMap((s) => s.questions)
            .find((q) => q.id === questionId);
          return value
            .map((v) => {
              const opt = question2?.options?.find((o) => o.value === v);
              return opt?.label || v;
            })
            .join(", ");
        }
        return String(value);
      
      case "yes-no-followup":
        if (typeof value === "object" && value !== null) {
          const yesNo = value.value ? "Yes" : "No";
          const followup = value.followup ? ` - ${value.followup}` : "";
          return yesNo + followup;
        }
        return value ? "Yes" : "No";
      
      case "priority-ranking":
        if (Array.isArray(value)) {
          const criteriaLabels: { [key: string]: string } = {
            functionalFit: "Functional fit",
            integrationFit: "Integration fit",
            multiEntity: "Multi-entity & consolidation",
            controlsAudit: "Controls & audit",
            implementationSpeed: "Implementation speed",
            tco5Year: "5-year TCO",
            partnerDelivery: "Partner delivery confidence",
          };
          return value
            .map((v, idx) => `${idx + 1}. ${criteriaLabels[v] || v}`)
            .join(", ");
        }
        return String(value);
      
      case "text":
        return String(value);
      
      default:
        return String(value);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-neutral-bg flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-elevated p-8">
            <h1 className="text-2xl font-bold text-brand-purple mb-6 text-center">
              Admin Access
            </h1>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-text mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-neutral-border rounded-xl focus:ring-2 focus:ring-brand-purple focus:border-brand-purple"
                  placeholder="Enter admin password"
                  autoFocus
                />
              </div>
              {error && (
                <div className="text-red-600 text-sm">{error}</div>
              )}
              <button
                type="submit"
                className="w-full bg-brand-purple text-white py-3 px-6 rounded-xl font-semibold hover:bg-brand-purpleDark transition-all"
              >
                Access Admin View
              </button>
            </form>
            <p className="text-xs text-neutral-muted mt-4 text-center">
              This page allows viewing questionnaire responses
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-bg py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-elevated p-6 mb-6">
          <div className="flex justify-between items-center flex-wrap gap-4">
            <div>
              <h1 className="text-2xl font-bold text-brand-purple">
                Admin - Response Viewer
              </h1>
              <p className="text-sm text-neutral-muted mt-1">
                View and manage questionnaire responses
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 border-2 border-red-500 text-red-600 rounded-lg font-semibold text-sm hover:bg-red-500 hover:text-white transition-all"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sidebar - Response List */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-card p-5 sticky top-4">
              <h2 className="font-bold text-brand-purple mb-4">Responses</h2>
              
              {/* Database Load Button (server-side via Netlify Function) */}
              <div className="mb-4">
                <button
                  onClick={loadDbResponses}
                  disabled={isLoadingDb}
                  className="w-full bg-brand-purple text-white py-2 px-4 rounded-xl font-semibold text-sm hover:bg-brand-purpleDark transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoadingDb ? "Loading..." : "Load responses"}
                </button>
                {dbError && (
                  <p className="text-xs text-red-600 mt-2 text-center">{dbError}</p>
                )}
                {dbResponses.length > 0 && !dbError && (
                  <p className="text-xs text-green-600 mt-2 text-center">
                    {dbResponses.length} response(s) loaded
                  </p>
                )}
              </div>

              {/* Import Button */}
              <div className="mb-4">
                <label className="block w-full bg-accent-coral text-white py-2 px-4 rounded-xl font-semibold text-sm hover:bg-accent-coralDark transition-all cursor-pointer text-center">
                  Import JSON File
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleFileImport}
                    className="hidden"
                  />
                </label>
                <p className="text-xs text-neutral-muted mt-2 text-center">
                  Import exported response files
                </p>
              </div>

              {/* Response List */}
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {(localResponse || importedResponses.length > 0 || dbResponses.length > 0) ? (
                  <>
                    {localResponse && (
                      <div className="mb-2">
                        <p className="text-xs text-neutral-muted mb-1 px-2">Local Storage</p>
                        <button
                          onClick={() => {
                            setSelectedResponse(localResponse);
                            setViewMode("detail");
                          }}
                          className={`w-full text-left p-3 rounded-xl border-2 transition-all ${
                            selectedResponse?.id === localResponse.id
                              ? "border-accent-coral bg-accent-coral/10"
                              : "border-neutral-border hover:border-brand-purple"
                          }`}
                        >
                          <div className="text-sm font-semibold text-neutral-text">
                            {localResponse.metadata.userName || localResponse.metadata.userEmail || `Response ${localResponse.id}`}
                          </div>
                          <div className="text-xs text-neutral-muted mt-1">
                            {localResponse.progress.percentComplete}% Complete
                          </div>
                        </button>
                      </div>
                    )}
                    {dbResponses.length > 0 && (
                      <div className="mb-2">
                        <p className="text-xs text-neutral-muted mb-1 px-2">Database ({dbResponses.length})</p>
                        {dbResponses.map((response) => (
                          <button
                            key={response.id}
                            onClick={() => {
                              setSelectedResponse(response);
                              setViewMode("detail");
                            }}
                            className={`w-full text-left p-3 rounded-xl border-2 transition-all mb-2 ${
                              selectedResponse?.id === response.id
                                ? "border-accent-coral bg-accent-coral/10"
                                : "border-neutral-border hover:border-brand-purple"
                            }`}
                          >
                            <div className="text-sm font-semibold text-neutral-text">
                              {response.metadata.userName || response.metadata.userEmail || `Response ${response.id}`}
                            </div>
                            <div className="text-xs text-neutral-muted mt-1">
                              {response.progress.percentComplete}% Complete
                            </div>
                            {response.completedAt && (
                              <div className="text-xs text-green-600 mt-1">
                                ✓ Completed
                              </div>
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                    {importedResponses.length > 0 && (
                      <div className="mb-2">
                        <p className="text-xs text-neutral-muted mb-1 px-2">Imported ({importedResponses.length})</p>
                        {importedResponses.map((response) => (
                          <button
                            key={response.id}
                            onClick={() => {
                              setSelectedResponse(response);
                              setViewMode("detail");
                            }}
                            className={`w-full text-left p-3 rounded-xl border-2 transition-all mb-2 ${
                              selectedResponse?.id === response.id
                                ? "border-accent-coral bg-accent-coral/10"
                                : "border-neutral-border hover:border-brand-purple"
                            }`}
                          >
                            <div className="text-sm font-semibold text-neutral-text">
                              {response.metadata.userName || response.metadata.userEmail || `Response ${response.id}`}
                            </div>
                            <div className="text-xs text-neutral-muted mt-1">
                              {response.progress.percentComplete}% Complete
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <p className="text-sm text-neutral-muted text-center py-4">
                    No responses found. Load responses, import a JSON file, or use this browser to complete the questionnaire.
                  </p>
                )}
              </div>
            </div>
          </aside>

          {/* Main Content - Response Detail */}
          <main className="lg:col-span-2">
            {selectedResponse ? (
              <div className="bg-white rounded-2xl shadow-card p-6 sm:p-8">
                <div className="flex justify-between items-start mb-6 flex-wrap gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-brand-purple mb-2">
                      {selectedResponse.metadata.userName || selectedResponse.metadata.userEmail || `Response ${selectedResponse.id}`}
                    </h2>
                    <div className="text-sm text-neutral-muted space-y-1">
                      <p>Started: {new Date(selectedResponse.startedAt).toLocaleString()}</p>
                      <p>Last Updated: {new Date(selectedResponse.lastUpdated).toLocaleString()}</p>
                      {selectedResponse.completedAt && (
                        <p className="text-green-600 font-semibold">
                          Completed: {new Date(selectedResponse.completedAt).toLocaleString()}
                        </p>
                      )}
                      <p>Progress: {selectedResponse.progress.percentComplete}% ({selectedResponse.progress.completedSections} of {selectedResponse.progress.totalSections} sections)</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleExportSelected}
                      className="px-4 py-2 bg-accent-coral text-white rounded-lg font-semibold text-sm hover:bg-accent-coralDark transition-all"
                    >
                      Export HTML
                    </button>
                    <button
                      onClick={() => handleExportJSON(selectedResponse)}
                      className="px-4 py-2 border-2 border-brand-purple text-brand-purple rounded-lg font-semibold text-sm hover:bg-brand-purple hover:text-white transition-all"
                    >
                      Export JSON
                    </button>
                  </div>
                </div>

                <div className="space-y-6">
                  {sections.map((section) => {
                    const sectionState = selectedResponse.sections[section.id];
                    if (!sectionState) return null;

                    return (
                      <div key={section.id} className="border-b border-neutral-border pb-6 last:border-b-0">
                        <h3 className="text-xl font-bold text-brand-purple mb-4">
                          {section.name}
                        </h3>
                        {sectionState.completed && (
                          <span className="inline-block bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded mb-4">
                            ✓ Completed
                          </span>
                        )}
                        <div className="space-y-4">
                          {section.questions.map((question) => {
                            const answer = sectionState.answers[question.id];
                            return (
                              <div key={question.id} className="bg-neutral-bg rounded-xl p-4">
                                <div className="font-semibold text-neutral-text mb-2">
                                  {question.label}
                                  {question.required && <span className="text-accent-coral ml-1">*</span>}
                                </div>
                                <div className="text-neutral-text">
                                  {answer !== undefined && answer !== null
                                    ? formatAnswer(question.id, answer, question.type)
                                    : <span className="text-neutral-muted italic">Not answered</span>}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-card p-12 text-center">
                <p className="text-neutral-muted">
                  Select a response from the sidebar to view details, or import a JSON file.
                </p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
