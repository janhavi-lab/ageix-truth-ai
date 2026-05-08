"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errorHandler = (err, _req, res, _next) => {
    const e = err;
    const status = e.statusCode ?? e.status ?? 500;
    const isProd = (process.env.NODE_ENV ?? "development") === "production";
    const message = status >= 500 && isProd ? "Internal server error" : e.message || "Error";
    if (status >= 500) {
        // eslint-disable-next-line no-console
        console.error("[AGEIX] Unhandled error:", e);
    }
    res.status(status).json({ message });
};
module.exports = { errorHandler };
//# sourceMappingURL=errorHandler.js.map