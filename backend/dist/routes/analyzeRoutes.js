"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { Router } = require("express");
const { analyzeController } = require("../controllers/analyzeController");
const analyzeRouter = Router();
analyzeRouter.post("/", analyzeController);
module.exports = { analyzeRouter };
//# sourceMappingURL=analyzeRoutes.js.map