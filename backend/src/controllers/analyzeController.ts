export {};

const { analyzeContent } = require("../services/analyzeService") as {
  analyzeContent: (content: string) => Promise<import("../services/analyzeService").AnalyzeServiceOutput>;
};

type RequestHandler = import("express").RequestHandler;

type ValidationError = { field: string; message: string };

function validateAnalyzeBody(body: unknown): { content?: string; errors: ValidationError[] } {
  const errors: ValidationError[] = [];

  if (!body || typeof body !== "object") {
    errors.push({ field: "body", message: "Request body must be a JSON object" });
    return { errors };
  }

  const content = (body as Record<string, unknown>).content;

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

const analyzeController: RequestHandler = async (req, res, next) => {
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
  } catch (err) {
    return next(err);
  }
};

module.exports = { analyzeController };

