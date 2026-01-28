import { QuestionnaireResponse, Progress, SectionState } from "@/types";
import { sections } from "./questions";

const STORAGE_KEY = "erp-questionnaire-response";

export function getResponse(): QuestionnaireResponse | null {
  if (typeof window === "undefined") return null;
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    
    const response = JSON.parse(stored) as QuestionnaireResponse;
    // Validate and migrate if needed
    return response;
  } catch (error) {
    console.error("Error loading from localStorage:", error);
    return null;
  }
}

export function saveResponse(response: QuestionnaireResponse): void {
  if (typeof window === "undefined") return;
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(response));
  } catch (error) {
    console.error("Error saving to localStorage:", error);
    // Handle quota exceeded or other errors
    if (error instanceof DOMException && error.name === "QuotaExceededError") {
      alert("Storage limit exceeded. Please export your results and clear your browser data.");
    }
  }
}

export function createInitialResponse(): QuestionnaireResponse {
  const now = new Date().toISOString();
  const sectionStates: { [key: string]: SectionState } = {};
  
  // Initialize all sections from questions data
  sections.forEach((section) => {
    sectionStates[section.id] = {
      id: section.id,
      name: section.name,
      completed: false,
      completedAt: null,
      answers: {},
      lastModified: now,
    };
  });

  const response: QuestionnaireResponse = {
    id: `local-${Date.now()}`,
    timestamp: now,
    lastUpdated: now,
    startedAt: now,
    completedAt: null,
    progress: {
      totalSections: sections.length,
      completedSections: 0,
      percentComplete: 0,
      currentSection: 1,
    },
    sections: sectionStates,
    metadata: {
      userName: "",
      userEmail: "",
    },
  };

  saveResponse(response);
  return response;
}

export function calculateProgress(sectionStates: { [key: string]: SectionState }): Progress {
  const totalSections = Object.keys(sectionStates).length;
  const completedSections = Object.values(sectionStates).filter((s) => s.completed).length;
  const percentComplete = Math.round((completedSections / totalSections) * 100);
  
  // Find first incomplete section by checking sections in order
  let currentSection = 1;
  for (let i = 0; i < sections.length; i++) {
    const sectionId = sections[i].id;
    if (!sectionStates[sectionId]?.completed) {
      currentSection = i + 1;
      break;
    }
  }

  return {
    totalSections,
    completedSections,
    percentComplete,
    currentSection,
  };
}

export function clearResponse(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}
