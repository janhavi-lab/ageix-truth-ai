type RequestHandler = import("express").RequestHandler;

const notFoundHandler: RequestHandler = (req, res) => {
  res.status(404).json({
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
};

module.exports = { notFoundHandler };

