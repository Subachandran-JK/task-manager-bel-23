const express = require("express");
const taskController = require("../controller/taskController");
const {
  validateTask,
  validateTaskQuery,
  validateTaskId,
  validatePriorityLevel,
} = require("../middleware/validateTaskMiddleware");

const router = express.Router();

router.param("taskId", validateTaskId);
router.param("level", validatePriorityLevel);

router.get("/", validateTaskQuery, async (req, res) => {
  const { completed, sort, order } = req.query;
  const tasks = await taskController.getAllTasks({
    completed: completed === undefined ? undefined : completed === "true",
    sort,
    order,
  });
  res.json(tasks);
});

router.get("/priority/:level", async (req, res) => {
  const tasks = await taskController.getTasksByPriority(req.params.level);
  res.json(tasks);
});

router.get("/:taskId", async (req, res) => {
  const task = await taskController.getTaskById(parseInt(req.params.taskId));
  res.json(task);
});

router.post("/", validateTask, async (req, res) => {
  const task = await taskController.createTask(req.body);
  res.status(201).json(task);
});

router.put("/:taskId", validateTask, async (req, res) => {
  const task = await taskController.updateTask(parseInt(req.params.taskId), req.body);
  res.json(task);
});

router.delete("/:taskId", async (req, res) => {
  const task = await taskController.deleteTask(parseInt(req.params.taskId));
  res.json(task);
});

module.exports = router;
