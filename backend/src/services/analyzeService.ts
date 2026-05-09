export {};

const { detectInputType } = require("../utils/detectInputType") as {
  detectInputType: (input: string) => import("../utils/detectInputType").InputType;
};

const { predictSpam } = require("./spamDetectorService") as {
  predictSpam: (
    content: string,
  ) => Promise<import("./spamDetectorService").SpamDetectorOutput>;
};

const { getSupabaseClient } = require("../config/supabase") as {
  getSupabaseClient: () => import("@supabase/supabase-js").SupabaseClient;
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
        reason: ["Possible misinformation indicators detected"],
        suggestion: ["Cross-check with trusted sources"],
      };

    case "message":
    default:
      return {
        status: "Fake",
        reason: ["Potential spam/scam indicators detected"],
        suggestion: ["Avoid sharing personal info"],
      };
  }
}

function buildSpamDetectorResult(
  prediction: string,
  confidence: number,
): AnalyzeResult {
  const p = prediction.toLowerCase();

  const isBad =
    p.includes("spam") ||
    p.includes("fake") ||
    p.includes("scam") ||
    p.includes("fraud");

  const confidencePct = `${Math.round(confidence * 100)}%`;

  if (isBad) {
    return {
      status: "Fake",
      reason: [
        `Spam detector flagged this message as "${prediction}" (${confidencePct} confidence)`,
      ],
      suggestion: [
        "Do not respond",
        "Avoid clicking suspicious links",
      ],
    };
  }

  return {
    status: "Fake",
    reason: [`Prediction returned "${prediction}" (${confidencePct} confidence)`],
    suggestion: [
      "Proceed carefully",
      "Avoid sharing sensitive information",
    ],
  };
}

function buildSafeFallbackResult(): AnalyzeResult {
  return {
    status: "Fake",
    reason: ["AI service unavailable"],
    suggestion: ["Treat this message cautiously"],
  };
}

async function saveScanToSupabase(args: {
  content: string;
  result: string;
  confidence: number;
  modelUsed: string;
}): Promise<void> {
  try {
    console.log("[AGEIX] Initializing Supabase client...");

    const supabase = getSupabaseClient();

    console.log("[AGEIX] Attempting Supabase insert...");

    const { data, error } = await supabase
      .from("scans")
      .insert([
        {
          content: args.content,
          result: args.result,
          confidence: args.confidence,
          model_used: args.modelUsed,
          created_at: new Date().toISOString(),
        },
      ])
      .select();

    console.log("[AGEIX] Insert error:", error);
    console.log("[AGEIX] Insert data:", data);

    if (error) {
      console.warn("[AGEIX] Supabase insert failed:", error.message);
      return;
    }

    console.log("[AGEIX] Scan saved successfully.");
  } catch (err) {
    console.error("[AGEIX] Supabase unavailable:", err);
  }
}

async function analyzeContent(
    content: string,
  ): Promise<AnalyzeServiceOutput> {
  
    const inputType = detectInputType(content);
  
    if (inputType === "message") {
  
      try {
  
        const { prediction, confidence } = await predictSpam(content);
  
        await saveScanToSupabase({
          content,
          result: prediction,
          confidence,
          modelUsed: "flask-spam-detector",
        });
  
        return {
          inputType,
          result: buildSpamDetectorResult(prediction, confidence),
        };
  
      } catch (err) {
  
        console.error("[AGEIX] Spam detector failed:", err);
  
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