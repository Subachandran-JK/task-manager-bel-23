const { AppError } = require("../utils/appError");

const notFound = (req, res, next) => {
  next(new AppError(404, `Route ${req.method} ${req.originalUrl} not found`));
};

const errorHandler = (err, req, res, next) => {
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ message: "Request body is not valid JSON" });
  }
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ message: err.message, errors: err.errors });
  }
  console.error(err);
  res.status(500).json({ message: "Internal server error" });
};

module.exports = { notFound, errorHandler };
