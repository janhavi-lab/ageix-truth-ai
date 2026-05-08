"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const { healthRouter } = require("./routes/health.route");
const { analyzeRouter } = require("./routes/analyzeRoutes");
const { notFoundHandler } = require("./middleware/notFoundHandler");
const { errorHandler } = require("./middleware/errorHandler");
function createApp() {
    const app = express();
    app.disable("x-powered-by");
    app.set("trust proxy", 1);
    app.use((req, res, next) => {
        const origin = req.headers.origin;
        if (origin)
            res.setHeader("Access-Control-Allow-Origin", origin);
        res.setHeader("Vary", "Origin");
        res.setHeader("Access-Control-Allow-Credentials", "true");
        res.setHeader("Access-Control-Allow-Headers", req.headers["access-control-request-headers"] ?? "Content-Type, Authorization");
        res.setHeader("Access-Control-Allow-Methods", req.headers["access-control-request-method"] ?? "GET,POST,PUT,PATCH,DELETE,OPTIONS");
        if (req.method === "OPTIONS")
            return res.sendStatus(204);
        return next();
    });
    app.use(express.json({ limit: "1mb" }));
    app.use("/api/health", healthRouter);
    app.use("/api/analyze", analyzeRouter);
    app.use(notFoundHandler);
    app.use(errorHandler);
    return app;
}
module.exports = { createApp };
//# sourceMappingURL=app.js.map