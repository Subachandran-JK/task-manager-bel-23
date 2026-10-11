const fs = require("fs");
const path = require("path");

const DATA_FILE = path.join(__dirname, "../data/tasks.json");
// don't write to the file while running tests
const PERSIST = process.env.NODE_ENV !== "test" && !process.env.TAP;

let tasks = null;

// make sure the data file exists before the server starts
const init = async () => {
  try {
    await fs.promises.access(DATA_FILE);
  } catch {
    await fs.promises.mkdir(path.dirname(DATA_FILE), { recursive: true });
    await fs.promises.writeFile(DATA_FILE, JSON.stringify({ tasks: [] }, null, 2) + "\n");
  }
  await readAll();
};

const readAll = async () => {
  if (!tasks) {
    const content = await fs.promises.readFile(DATA_FILE, "utf-8");
    tasks = JSON.parse(content).tasks;
  }
  return tasks;
};

// update memory first, roll back if the file write fails
const writeAll = async (data) => {
  const previous = tasks;
  tasks = data;
  if (!PERSIST) return;
  try {
    await fs.promises.writeFile(DATA_FILE, JSON.stringify({ tasks: data }, null, 2) + "\n");
  } catch (err) {
    tasks = previous;
    throw err;
  }
};

module.exports = { init, readAll, writeAll };
