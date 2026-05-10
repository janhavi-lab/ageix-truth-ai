const express = require("express") as typeof import("express");
const { healthRouter } = require("./routes/health.route") as { healthRouter: import("express").Router };
const { analyzeRouter } = require("./routes/analyzeRoutes") as { analyzeRouter: import("express").Router };
const { notFoundHandler } = require("./middleware/notFoundHandler") as { notFoundHandler: import("express").RequestHandler };
const { errorHandler } = require("./middleware/errorHandler") as { errorHandler: import("express").ErrorRequestHandler };

type ExpressApp = import("express").Express;

function createApp(): ExpressApp {
  const app = express();

  app.disable("x-powered-by");
  app.set("trust proxy", 1);

  app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (origin) res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader(
      "Access-Control-Allow-Headers",
      req.headers["access-control-request-headers"] ?? "Content-Type, Authorization",
    );
    res.setHeader(
      "Access-Control-Allow-Methods",
      req.headers["access-control-request-method"] ?? "GET,POST,PUT,PATCH,DELETE,OPTIONS",
    );
    if (req.method === "OPTIONS") return res.sendStatus(204);
    return next();
  });
  app.use(express.json({ limit: "1mb" }));

  app.use("/api/health", healthRouter);
  app.use("/api/analyze", analyzeRouter);
  app.get("/", (_req, res) => {
    res.status(200).json({
      service: "AGEIX Backend API",
      status: "running",
      message: "Backend deployed successfully 🚀",
      endpoints: {
        analyze: "/api/analyze"
      }
    });
  });

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

module.exports = { createApp };

