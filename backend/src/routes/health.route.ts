const { Router } = require("express") as typeof import("express");

const healthRouter = Router();

healthRouter.get("/", (_req, res) => {
  res.status(200).json({
    status: "ok",
    message: "AGEIX backend running",
  });
});

module.exports = { healthRouter };

