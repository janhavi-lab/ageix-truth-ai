export {};

const { detectInputType } = require("../utils/detectInputType") as {
  detectInputType: (input: string) => import("../utils/detectInputType").InputType;
};
const { predictSpam } = require("./spamDetectorService") as {
  predictSpam: (content: string) => Promise<import("./spamDetectorService").SpamDetectorOutput>;
};

export type AnalyzeResult = {
  status: "Fake";
  reason: string[];
  suggestion: string[];
};

export type AnalyzeServiceOutput = {
  inputType: import("../utils/detectInputType").InputType;
  result: AnalyzeResult;
};

function buildDummyResult(
  inputType: import("../utils/detectInputType").InputType,
): AnalyzeResult {
  switch (inputType) {
    case "url":
      return {
        status: "Fake",
        reason: ["Potential phishing or malicious link patterns detected"],
        suggestion: ["Do not click the link", "Verify the domain before visiting"],
      };
    case "news":
      return {
        status: "Fake",
        reason: ["Possible misinformation indicators detected in long-form content"],
        suggestion: ["Cross-check with trusted sources", "Look for primary references"],
      };
    case "message":
    default:
      return {
        status: "Fake",
        reason: ["Basic message heuristics flagged potential spam/scam content"],
        suggestion: ["Avoid sharing personal info", "Verify the sender independently"],
      };
  }
}

function buildSpamDetectorResult(
  prediction: string,
  confidence: number,
): AnalyzeResult {
  const p = prediction.toLowerCase();
  const isBad = /spam|scam|phish|malicious|fraud/.test(p);

  const confidencePct = `${Math.round(Math.max(0, Math.min(1, confidence)) * 100)}%`;

  if (isBad) {
    return {
      status: "Fake",
      reason: [
        `Spam detector flagged this message as "${prediction}" (confidence ${confidencePct})`,
      ],
      suggestion: ["Do not respond or click links", "Block/report the sender if applicable"],
    };
  }

  return {
    status: "Fake",
    reason: [`Spam detector returned "${prediction}" (confidence ${confidencePct})`],
    suggestion: ["Proceed cautiously", "Avoid sharing sensitive information"],
  };
}

function buildSafeFallbackResult(): AnalyzeResult {
  return {
    status: "Fake",
    reason: ["Spam detector service unavailable; returning safe fallback response"],
    suggestion: ["Treat this message as suspicious", "Avoid clicking links or sharing credentials"],
  };
}

async function analyzeContent(content: string): Promise<AnalyzeServiceOutput> {
  const inputType = detectInputType(content);

  if (inputType === "message") {
    try {
      const { prediction, confidence } = await predictSpam(content);
      return {
        inputType,
        result: buildSpamDetectorResult(prediction, confidence),
      };
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("[AGEIX] Spam detector call failed:", err);
      return {
        inputType,
        result: buildSafeFallbackResult(),
      };
    }
  }

  return {
    inputType,
    result: buildDummyResult(inputType),
  };
}

module.exports = { analyzeContent };

