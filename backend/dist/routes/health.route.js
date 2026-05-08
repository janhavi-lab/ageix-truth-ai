"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { Router } = require("express");
const healthRouter = Router();
healthRouter.get("/", (_req, res) => {
    res.status(200).json({
        status: "ok",
        message: "AGEIX backend running",
    });
});
module.exports = { healthRouter };
//# sourceMappingURL=health.route.js.map