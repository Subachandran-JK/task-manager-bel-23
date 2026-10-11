require("dotenv").config({ quiet: true });
const express = require("express");
const { logger } = require("./middleware/loggerMiddleware");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const taskRoutes = require("./routes/taskRoutes");
const taskModel = require("./models/taskModel");

const PORT = parseInt(process.env.PORT) || 3000;

const app = express();

app.use(logger);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/tasks", taskRoutes); // OCP

app.use(notFound);
app.use(errorHandler);

// don't listen when imported by the tests
if (require.main === module) {
  taskModel
    .init()
    .then(() => {
      app.listen(PORT, (err) => {
        if (err) {
          return console.log("Something bad happened", err);
        }
        console.log(`Server is running on port ${PORT}`);
      });
    })
    .catch((err) => {
      console.error("Failed to load task data", err);
      process.exit(1);
    });
}

module.exports = app;
