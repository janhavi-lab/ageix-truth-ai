"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function readNumberEnv(name, fallback) {
    const raw = process.env[name];
    if (!raw)
        return fallback;
    const n = Number(raw);
    return Number.isFinite(n) && n > 0 ? n : fallback;
}
function normalizeBaseUrl(url) {
    return url.replace(/\/+$/, "");
}
function getAiServicesConfig() {
    const spamDetectorBaseUrl = normalizeBaseUrl(process.env.AGEIX_SPAM_DETECTOR_URL ?? "http://127.0.0.1:5003");
    const timeoutMs = readNumberEnv("AGEIX_AI_TIMEOUT_MS", 5000);
    return { spamDetectorBaseUrl, timeoutMs };
}
module.exports = { getAiServicesConfig };
//# sourceMappingURL=aiServices.js.map