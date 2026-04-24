const { AppError } = require("../utils/errors");

// Express (must 4 args)
function errorHandler(err, _req, res, _next) {
  if (err instanceof AppError)
    return res.status(err.statusCode).json({ error: err.message });
  // hidden internals for safety/ unexpected failures
  res.status(500).json({ error: "Internal server error" });
}

module.exports = errorHandler;
