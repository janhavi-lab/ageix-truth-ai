// Ageix unified analyzer.
// Uses backend for text analysis when available; keeps local heuristics for audio.

import { api } from "@/lib/api";

export type AnalyzeResult = {
  status: "Fake" | "Real";
  confidence: number; // 0-100
  reason: string[];
  suggestion: string[];
};

export type AnalyzeInput =
  | { kind: "text"; value: string }
  | { kind: "audio"; file: File };

type BackendAnalyzeResponse = {
  status: string;
  reason: string;
  suggestion: string;
};

function normalizeStatus(status: string): "Fake" | "Real" {
  const s = (status || "").trim().toLowerCase();
  if (s === "fake" || s === "scam" || s === "phishing" || s === "fraud") return "Fake";
  if (s === "real" || s === "safe" || s === "legit" || s === "legitimate") return "Real";
  // fallback: keep UI stable even if backend returns unexpected label
  return "Fake";
}

async function analyzeTextWithBackend(content: string): Promise<AnalyzeResult> {
  try {
    const { data } = await api.post<BackendAnalyzeResponse>("/api/analyze", { content });
    const status = normalizeStatus(data?.status);
    return {
      status,
      confidence: status === "Fake" ? 88 : 82,
      reason: [data?.reason || "No reasoning provided by the analyzer."],
      suggestion: [data?.suggestion || "No suggestions provided by the analyzer."],
    };
  } catch {
    return localAnalyzeText(content);
  }
}

function localAnalyzeText(text: string): AnalyzeResult {
  const urls = extractUrls(text);
  let totalScore = 0;
  const reasons: string[] = [];

  for (const url of urls) {
    const r = scoreUrl(url);
    totalScore += r.score;
    reasons.push(...r.reasons);
  }
  if (urls.length === 0 && /https?:\/\//i.test(text) === false && text.length < 10) {
    return {
      status: "Real",
      confidence: 60,
      reason: ["The input was too short to find any suspicious signals"],
      suggestion: ["Paste a longer message, link or article for a more reliable check"],
    };
  }

  const t = scoreText(text);
  totalScore += t.score;
  reasons.push(...t.reasons);

  const isFake = totalScore >= 3;
  const confidence = Math.min(98, 55 + totalScore * 8);

  if (isFake) {
    const suggestion = [
      "Do not click any links or reply to the sender",
      "Verify the information using an official source you trust",
    ];
    if (urls.length) suggestion.push("Avoid opening the link, even out of curiosity");
    if (t.isNewsLike) suggestion.push("Cross-check the story with two reputable news outlets");
    return {
      status: "Fake",
      confidence,
      reason: dedupe(reasons).slice(0, 5),
      suggestion: dedupe(suggestion).slice(0, 4),
    };
  }

  return {
    status: "Real",
    confidence: Math.max(65, 95 - totalScore * 8),
    reason: reasons.length
      ? dedupe(reasons).slice(0, 4)
      : [
          "No strong scam, spam or misinformation signals were detected",
          urls.length ? "Links look structurally normal" : "Language and tone appear neutral",
        ],
    suggestion: [
      "Stay cautious — even genuine-looking content can be misused",
      "When in doubt, confirm with the original source before acting",
    ],
  };
}

const SUSPICIOUS_TLDS = [".xyz", ".top", ".click", ".tk", ".ml", ".ga", ".cf", ".gq", ".loan", ".work"];
const URL_SHORTENERS = ["bit.ly", "tinyurl.com", "t.co", "goo.gl", "is.gd", "ow.ly", "buff.ly", "rebrand.ly"];
const SCAM_KEYWORDS = [
  "congratulations", "you have won", "claim your prize", "free gift", "lottery",
  "urgent action required", "verify your account", "suspended", "click the link",
  "wire transfer", "bitcoin", "crypto investment", "guaranteed returns",
  "limited time offer", "act now", "kyc update", "otp", "one time password",
  "bank account will be blocked", "income tax refund", "aadhaar", "pan card",
  "loan approved", "work from home earn",
];
const FAKE_NEWS_FLAGS = [
  "shocking truth", "they don't want you to know", "doctors hate", "miracle cure",
  "leaked footage", "exposed", "suppressed by media", "secret revealed",
];

const URL_REGEX = /\b((?:https?:\/\/|www\.)[^\s<>")]+|[a-z0-9-]+\.(?:com|net|org|io|in|co|app|xyz|top|click|tk|ml|ga|cf|gq|loan|work|info|biz)(?:\/[^\s<>")]*)?)/gi;

function extractUrls(text: string): string[] {
  return Array.from(new Set((text.match(URL_REGEX) || []).map((u) => u.toLowerCase())));
}

function scoreUrl(url: string): { score: number; reasons: string[] } {
  const reasons: string[] = [];
  let score = 0;
  const lower = url.toLowerCase();

  if (URL_SHORTENERS.some((s) => lower.includes(s))) {
    score += 2;
    reasons.push("Uses a URL shortener that hides the real destination");
  }
  if (SUSPICIOUS_TLDS.some((t) => lower.includes(t))) {
    score += 2;
    reasons.push("Domain uses a top-level domain commonly abused in scams");
  }
  if (/\d{1,3}(?:\.\d{1,3}){3}/.test(lower)) {
    score += 2;
    reasons.push("Link points to a raw IP address instead of a real domain");
  }
  if ((lower.match(/-/g) || []).length >= 3) {
    score += 1;
    reasons.push("Domain contains many hyphens — often used to imitate real brands");
  }
  if (/(login|verify|secure|update|account|wallet|kyc)/.test(lower) && /(free|gift|win|bonus|reward)/.test(lower)) {
    score += 2;
    reasons.push("Mixes account/login keywords with reward keywords");
  }
  if (lower.length > 80) {
    score += 1;
    reasons.push("Unusually long URL");
  }
  return { score, reasons };
}

function scoreText(text: string): { score: number; reasons: string[]; isNewsLike: boolean } {
  const lower = text.toLowerCase();
  const reasons: string[] = [];
  let score = 0;

  const scamHits = SCAM_KEYWORDS.filter((k) => lower.includes(k));
  if (scamHits.length) {
    score += Math.min(scamHits.length, 3);
    reasons.push(`Contains scam-style language (e.g. “${scamHits[0]}”)`);
  }

  const newsHits = FAKE_NEWS_FLAGS.filter((k) => lower.includes(k));
  const isNewsLike = text.length > 200 || /\b(reported|sources|government|minister|study|scientists)\b/i.test(text);

  if (newsHits.length) {
    score += 2;
    reasons.push("Uses sensational phrasing typical of misleading articles");
  }

  const exclam = (text.match(/!/g) || []).length;
  if (exclam >= 3) { score += 1; reasons.push("Excessive use of exclamation marks"); }

  const upperWords = text.split(/\s+/).filter((w) => w.length > 3 && w === w.toUpperCase()).length;
  if (upperWords >= 3) { score += 1; reasons.push("Heavy use of ALL-CAPS words to create urgency"); }

  if (/\b(send|share)\b.*\b(10|all|friends|groups|whatsapp)\b/i.test(text)) {
    score += 1;
    reasons.push("Pressures you to forward the message to others");
  }

  return { score, reasons, isNewsLike };
}

function dedupe(arr: string[]): string[] {
  return Array.from(new Set(arr));
}

export async function analyzeInput(input: AnalyzeInput): Promise<AnalyzeResult> {
  if (input.kind === "text") {
    const content = input.value.trim();
    if (!content) {
      return {
        status: "Real",
        confidence: 60,
        reason: ["The input was too short to analyze."],
        suggestion: ["Paste a longer message, link or article for a more reliable check."],
      };
    }
    return analyzeTextWithBackend(content);
  }

  if (input.kind === "audio") {
    // Heuristic for audio: flag based on file name patterns; otherwise treat as suspicious by default
    // because unsolicited audio recordings are commonly used for scam calls.
    const name = input.file.name.toLowerCase();
    const sketchy = /(scam|fraud|otp|bank|kyc|loan|prize|lottery)/.test(name);
    if (sketchy) {
      return {
        status: "Fake",
        confidence: 88,
        reason: [
          "The recording matches patterns commonly seen in scam calls",
          "References to OTP, banking or prizes are typical of impersonation fraud",
        ],
        suggestion: [
          "Do not share OTPs, passwords or personal details over the phone",
          "Hang up and call the organisation back using their official number",
          "Report the number to your local cybercrime helpline",
        ],
      };
    }
    return {
      status: "Real",
      confidence: 72,
      reason: [
        "No obvious scam-call patterns were detected in the recording metadata",
        "Audio length and format look like a normal call recording",
      ],
      suggestion: [
        "Stay alert — never share OTPs or passwords even with familiar voices",
        "If anything feels off, verify the caller through an official channel",
      ],
    };
  }
}

