const taskModel = require("../models/taskModel");
const { AppError } = require("../utils/appError");

const findTaskIndex = (tasks, taskId) => {
  const index = tasks.findIndex((task) => task.id === taskId);
  if (index === -1) {
    throw new AppError(404, "Task not found");
  }
  return index;
};

const byCreatedAt = (a, b) => new Date(a.createdAt) - new Date(b.createdAt) || a.id - b.id;

const getAllTasks = async ({ completed, sort, order } = {}) => {
  let tasks = await taskModel.readAll();
  if (completed !== undefined) {
    tasks = tasks.filter((task) => task.completed === completed);
  }
  if (sort === "createdAt") {
    // sort a copy, sort() would change the original array
    tasks = [...tasks].sort(byCreatedAt);
    if (order === "desc") {
      tasks.reverse();
    }
  }
  return tasks;
};

const getTasksByPriority = async (level) => {
  const tasks = await taskModel.readAll();
  return tasks.filter((task) => task.priority === level);
};

const getTaskById = async (taskId) => {
  const tasks = await taskModel.readAll();
  return tasks[findTaskIndex(tasks, taskId)];
};

const createTask = async ({ title, description, completed, priority = "medium" }) => {
  const tasks = await taskModel.readAll();
  // not tasks.length, ids would repeat after a delete
  const id = tasks.reduce((max, task) => Math.max(max, task.id), 0) + 1;
  const task = {
    id,
    title: title.trim(),
    description: description.trim(),
    completed,
    priority,
    createdAt: new Date().toISOString(),
  };
  await taskModel.writeAll([...tasks, task]);
  return task;
};

// createdAt never changes, priority stays the same if not sent
const updateTask = async (taskId, { title, description, completed, priority }) => {
  const tasks = await taskModel.readAll();
  const index = findTaskIndex(tasks, taskId);
  const existing = tasks[index];
  const updated = {
    id: taskId,
    title: title.trim(),
    description: description.trim(),
    completed,
    priority: priority || existing.priority || "medium",
    createdAt: existing.createdAt,
  };
  await taskModel.writeAll(tasks.map((task, i) => (i === index ? updated : task)));
  return updated;
};

const deleteTask = async (taskId) => {
  const tasks = await taskModel.readAll();
  const index = findTaskIndex(tasks, taskId);
  const deleted = tasks[index];
  await taskModel.writeAll(tasks.filter((task, i) => i !== index));
  return deleted;
};

module.exports = { getAllTasks, getTasksByPriority, getTaskById, createTask, updateTask, deleteTask };
