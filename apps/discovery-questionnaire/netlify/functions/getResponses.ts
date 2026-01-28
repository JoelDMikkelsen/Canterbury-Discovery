import type { Handler, HandlerEvent, HandlerResponse } from "@netlify/functions";

/**
 * Admin-only read access for questionnaire responses.
 *
 * Security model:
 * - Supabase RLS stays ENABLED.
 * - anon INSERT is allowed so the browser can submit responses.
 * - anon SELECT is NOT allowed, so the browser must NOT read responses directly.
 * - This Netlify Function uses the SUPABASE_SERVICE_ROLE_KEY server-side to bypass RLS
 *   for admin reads. The service role key must NEVER be shipped to the browser.
 */

type Json =
  | null
  | boolean
  | number
  | string
  | Json[]
  | { [key: string]: Json };

function json(statusCode: number, body: Json): HandlerResponse {
  return {
    statusCode,
    headers: {
      "content-type": "application/json; charset=utf-8",
      // Basic CORS (OK for now). If you later lock this down, change '*' to your Netlify domain.
      "access-control-allow-origin": "*",
      "access-control-allow-headers": "content-type",
      "access-control-allow-methods": "GET,OPTIONS",
    },
    body: JSON.stringify(body),
  };
}

async function queryViaSupabaseJs(supabaseUrl: string, serviceRoleKey: string) {
  // Prefer supabase-js if installed; fall back to REST if not.
  // Netlify Functions run server-side, so importing this package is safe.
  const mod = await import("@supabase/supabase-js");
  const createClient: any = (mod as any).createClient;
  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false },
  });

  const { data, error } = await supabase
    .from("questionnaire_responses")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message || "Supabase query failed");
  return data ?? [];
}

async function queryViaRest(supabaseUrl: string, serviceRoleKey: string) {
  const url =
    `${supabaseUrl}/rest/v1/questionnaire_responses?select=*` +
    `&order=created_at.desc`;

  const res = await fetch(url, {
    headers: {
      apikey: serviceRoleKey,
      authorization: `Bearer ${serviceRoleKey}`,
    },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Supabase REST query failed: ${res.status} ${text}`);
  }
  return (await res.json()) as any[];
}

export const handler: Handler = async (event: HandlerEvent) => {
  if (event.httpMethod === "OPTIONS") {
    return json(200, { ok: true });
  }

  if (event.httpMethod !== "GET") {
    return json(405, { ok: false, error: "Method not allowed" });
  }

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl) {
      return json(500, { ok: false, error: "Missing NEXT_PUBLIC_SUPABASE_URL" });
    }
    if (!serviceRoleKey) {
      return json(500, { ok: false, error: "Missing SUPABASE_SERVICE_ROLE_KEY" });
    }

    let rows: any[] = [];
    try {
      rows = await queryViaSupabaseJs(supabaseUrl, serviceRoleKey);
    } catch (err: any) {
      // If @supabase/supabase-js isn't installed, or import fails, fall back to REST.
      const message = String(err?.message || err || "");
      if (message.includes("Cannot find module") || message.includes("ERR_MODULE_NOT_FOUND")) {
        rows = await queryViaRest(supabaseUrl, serviceRoleKey);
      } else {
        throw err;
      }
    }

    return json(200, { ok: true, data: rows });
  } catch (err: any) {
    return json(500, { ok: false, error: err?.message || "Failed to fetch responses" });
  }
};

