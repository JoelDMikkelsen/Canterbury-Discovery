// Supabase client for storing questionnaire responses
// This is a client-side only implementation for static sites

export interface SupabaseConfig {
  url: string;
  anonKey: string;
}

// These will be set via environment variables or hardcoded
// For static sites, we can use public (anon) keys safely
let supabaseConfig: SupabaseConfig | null = null;

export function initSupabase(url: string, anonKey: string) {
  supabaseConfig = { url, anonKey };
}

export async function saveResponseToSupabase(response: any): Promise<{ success: boolean; error?: string }> {
  if (!supabaseConfig) {
    return { success: false, error: "Supabase not configured" };
  }

  try {
    const responseData = {
      id: response.id || `local-${Date.now()}`,
      response_data: response,
      user_name: response.metadata?.userName || "",
      user_email: response.metadata?.userEmail || "",
      started_at: response.startedAt,
      completed_at: response.completedAt,
      progress_percent: response.progress?.percentComplete || 0,
      created_at: new Date().toISOString(),
    };

    const res = await fetch(`${supabaseConfig.url}/rest/v1/questionnaire_responses`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": supabaseConfig.anonKey,
        "Authorization": `Bearer ${supabaseConfig.anonKey}`,
        "Prefer": "return=minimal",
      },
      body: JSON.stringify(responseData),
    });

    if (!res.ok) {
      const error = await res.text();
      return { success: false, error: `Failed to save: ${error}` };
    }

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Unknown error" };
  }
}

export async function getAllResponsesFromSupabase(): Promise<{ data: any[] | null; error?: string }> {
  if (!supabaseConfig) {
    return { data: null, error: "Supabase not configured" };
  }

  try {
    const res = await fetch(
      `${supabaseConfig.url}/rest/v1/questionnaire_responses?select=*&order=created_at.desc`,
      {
        headers: {
          "apikey": supabaseConfig.anonKey,
          "Authorization": `Bearer ${supabaseConfig.anonKey}`,
        },
      }
    );

    if (!res.ok) {
      const error = await res.text();
      return { data: null, error: `Failed to fetch: ${error}` };
    }

    const data = await res.json();
    return { data };
  } catch (error: any) {
    return { data: null, error: error.message || "Unknown error" };
  }
}
