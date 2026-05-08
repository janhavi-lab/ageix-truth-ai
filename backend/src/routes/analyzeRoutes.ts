export {};

const { Router } = require("express") as typeof import("express");
const { analyzeController } = require("../controllers/analyzeController") as {
  analyzeController: import("express").RequestHandler;
};

const analyzeRouter = Router();

analyzeRouter.post("/", analyzeController);

module.exports = { analyzeRouter };

