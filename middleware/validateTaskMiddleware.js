const { AppError } = require("../utils/appError");

const PRIORITIES = ["low", "medium", "high"];

const isNonEmptyString = (value) => typeof value === "string" && value.trim() !== "";

const validateTask = (req, res, next) => {
  const body = req.body;
  if (!body || typeof body !== "object") {
    return next(new AppError(400, "Request body must be a JSON object"));
  }
  const errors = [];
  if (!isNonEmptyString(body.title)) {
    errors.push("title is required and must be a non-empty string");
  }
  if (!isNonEmptyString(body.description)) {
    errors.push("description is required and must be a non-empty string");
  }
  if (typeof body.completed !== "boolean") {
    errors.push("completed is required and must be a boolean");
  }
  if (body.priority !== undefined && !PRIORITIES.includes(body.priority)) {
    errors.push(`priority must be one of: ${PRIORITIES.join(", ")}`);
  }
  if (errors.length) {
    return next(new AppError(400, "Invalid task data", errors));
  }
  next();
};

const validateTaskQuery = (req, res, next) => {
  const { completed, sort, order } = req.query;
  const errors = [];
  if (completed !== undefined && completed !== "true" && completed !== "false") {
    errors.push("completed must be true or false");
  }
  if (sort !== undefined && sort !== "createdAt") {
    errors.push("sort must be createdAt");
  }
  if (order !== undefined && order !== "asc" && order !== "desc") {
    errors.push("order must be asc or desc");
  }
  if (errors.length) {
    return next(new AppError(400, "Invalid query parameters", errors));
  }
  next();
};

// parseInt('1.5') gives 1, so check the format first
const validateTaskId = (req, res, next, taskId) => {
  if (!/^[1-9]\d*$/.test(taskId)) {
    return next(new AppError(400, "Task id must be a positive integer"));
  }
  next();
};

const validatePriorityLevel = (req, res, next, level) => {
  if (!PRIORITIES.includes(level)) {
    return next(new AppError(400, `Priority level must be one of: ${PRIORITIES.join(", ")}`));
  }
  next();
};

module.exports = { validateTask, validateTaskQuery, validateTaskId, validatePriorityLevel };
