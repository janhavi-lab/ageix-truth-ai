import { supabase } from "@/lib/supabase";

export type ScanType = "Text" | "URL" | "Audio";

export type ScanHistoryRecord = {
  id: string;
  user_id: string;
  email: string;
  scan_type: ScanType;
  original_input: string;
  ai_verdict: string;
  confidence: number;
  created_at: string;
};

export type SaveScanHistoryParams = {
  userId: string;
  email: string;
  scanType: ScanType;
  originalInput: string;
  aiVerdict: "Fake" | "Real";
  confidence: number;
};

const URL_PATTERN = /^(https?:\/\/|www\.)/i;

export function detectScanType(input: {
  kind: "text" | "audio";
  value?: string;
}): ScanType {
  if (input.kind === "audio") return "Audio";
  const trimmed = (input.value ?? "").trim();
  if (URL_PATTERN.test(trimmed)) return "URL";
  return "Text";
}

export async function saveScanHistory(params: SaveScanHistoryParams): Promise<void> {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("You must be logged in to save scan history.");
  }

  if (user.id !== params.userId) {
    throw new Error("Cannot save scan history for another user.");
  }

  const { error } = await supabase.from("scan_history").insert({
    user_id: params.userId,
    email: params.email,
    scan_type: params.scanType,
    original_input: params.originalInput,
    ai_verdict: params.aiVerdict,
    confidence: params.confidence,
  });

  if (error) {
    console.error("SUPABASE INSERT ERROR:", error);
    throw error;
  }
}

export async function getUserScanHistory(limit?: number): Promise<ScanHistoryRecord[]> {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("You must be logged in to view scan history.");
  }

  let query = supabase
    .from("scan_history")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (limit !== undefined) {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  if (error) throw error;
  return (data ?? []) as ScanHistoryRecord[];
}
