"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const axios = require("axios");
const { getAiServicesConfig } = require("../config/aiServices");
function toOutput(raw) {
    const prediction = typeof raw.prediction === "string" ? raw.prediction : String(raw.prediction);
    const confidence = typeof raw.confidence === "number"
        ? raw.confidence
        : Number.parseFloat(String(raw.confidence));
    return {
        prediction,
        confidence: Number.isFinite(confidence) ? confidence : 0,
    };
}
async function predictSpam(content) {
    const { spamDetectorBaseUrl, timeoutMs } = getAiServicesConfig();
    const url = `${spamDetectorBaseUrl}/predict`;
    const res = await axios.post(url, { content }, { timeout: timeoutMs });
    return toOutput(res.data);
}
module.exports = { predictSpam };
//# sourceMappingURL=spamDetectorService.js.map