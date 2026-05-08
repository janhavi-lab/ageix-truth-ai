export {};

const axios = require("axios") as typeof import("axios");
const { getAiServicesConfig } = require("../config/aiServices") as {
  getAiServicesConfig: () => import("../config/aiServices").AiServicesConfig;
};

export type SpamDetectorResult = {
  prediction: unknown;
  confidence: unknown;
};

export type SpamDetectorOutput = {
  prediction: string;
  confidence: number;
};

function toOutput(raw: SpamDetectorResult): SpamDetectorOutput {
  const prediction =
    typeof raw.prediction === "string" ? raw.prediction : String(raw.prediction);
  const confidence =
    typeof raw.confidence === "number"
      ? raw.confidence
      : Number.parseFloat(String(raw.confidence));

  return {
    prediction,
    confidence: Number.isFinite(confidence) ? confidence : 0,
  };
}

async function predictSpam(content: string): Promise<SpamDetectorOutput> {
  const { spamDetectorBaseUrl, timeoutMs } = getAiServicesConfig();

  const url = `${spamDetectorBaseUrl}/predict`;
  const res = await axios.post(url, { content }, { timeout: timeoutMs });

  return toOutput(res.data as SpamDetectorResult);
}

module.exports = { predictSpam };

