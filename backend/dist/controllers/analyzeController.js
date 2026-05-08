"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { analyzeContent } = require("../services/analyzeService");
function validateAnalyzeBody(body) {
    const errors = [];
    if (!body || typeof body !== "object") {
        errors.push({ field: "body", message: "Request body must be a JSON object" });
        return { errors };
    }
    const content = body.content;
    if (content === undefined || content === null) {
        errors.push({ field: "content", message: "`content` is required" });
        return { errors };
    }
    if (typeof content !== "string") {
        errors.push({ field: "content", message: "`content` must be a string" });
        return { errors };
    }
    if (content.trim().length === 0) {
        errors.push({ field: "content", message: "`content` cannot be empty" });
        return { errors };
    }
    if (content.length > 5000) {
        errors.push({ field: "content", message: "`content` must be at most 5000 characters" });
        return { errors };
    }
    return { content, errors };
}
const analyzeController = async (req, res, next) => {
    try {
        const { content, errors } = validateAnalyzeBody(req.body);
        if (errors.length > 0 || !content) {
            return res.status(400).json({
                message: "Validation failed",
                errors,
            });
        }
        const analysis = await analyzeContent(content);
        return res.status(200).json(analysis.result);
    }
    catch (err) {
        return next(err);
    }
};
module.exports = { analyzeController };
//# sourceMappingURL=analyzeController.js.map