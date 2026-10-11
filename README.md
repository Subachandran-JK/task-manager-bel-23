# Task Manager API

Simple task manager API made with Node.js and Express. You can add, view, update and delete tasks. Tasks are saved in `data/tasks.json` so they are still there after restarting the server.

Other things it can do:
- filter tasks by completed status
- sort tasks by creation date
- set a priority (low, medium, high) on a task

## Getting started

Node 18 or higher is needed.

```bash
npm install
npm run dev
```

`npm run dev` uses nodemon, so the server restarts when a file changes. `npm start` runs it with plain node.

It runs on port 3000 by default. To change it, make a `.env` file:

```
PORT=4000
```

## Folders

```
app.js                  sets up middleware and routes, starts the server
data/tasks.json         saved tasks
models/taskModel.js     reads and writes the json file
controller/             task logic
routes/                 routes
middleware/             logger, validation, error handling
utils/appError.js       error class with a status code
postman/                postman collection
test/                   tests
```

## What a task looks like

```json
{
  "id": 1,
  "title": "Set up environment",
  "description": "Install Node.js, npm, and git",
  "completed": true,
  "priority": "medium",
  "createdAt": "2026-10-11T14:32:14.321Z"
}
```

- `title` and `description` are required and can't be empty
- `completed` is required and has to be `true` or `false` (the string "true" doesn't work)
- `priority` is optional, one of `low`, `medium`, `high`. If you don't send it, a new task gets `medium` and an update keeps the old value
- `id` and `createdAt` are set by the server

## Endpoints

- `GET /tasks` - all tasks
- `GET /tasks/:id` - one task
- `GET /tasks/priority/:level` - tasks with that priority
- `POST /tasks` - create a task
- `PUT /tasks/:id` - update a task
- `DELETE /tasks/:id` - delete a task

### GET /tasks

Returns all tasks. You can add these query params:

- `completed=true` or `completed=false` to filter
- `sort=createdAt` to sort by creation date (oldest first)
- `order=desc` together with `sort` to get newest first

```bash
curl "http://localhost:3000/tasks?completed=false&sort=createdAt&order=desc"
```

Any other value gives a 400.

### GET /tasks/:id

```bash
curl http://localhost:3000/tasks/1
```

Gives 404 if there is no task with that id.

### GET /tasks/priority/:level

```bash
curl http://localhost:3000/tasks/priority/high
```

Gives an empty array if there are no tasks with that priority. If the level is not low, medium or high you get a 400.

### POST /tasks

```bash
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{"title": "Write docs", "description": "Add the README", "completed": false, "priority": "high"}'
```

Returns the new task with status 201.

### PUT /tasks/:id

Replaces the task, so `title`, `description` and `completed` all have to be sent.

```bash
curl -X PUT http://localhost:3000/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{"title": "Write docs", "description": "README done", "completed": true}'
```

### DELETE /tasks/:id

```bash
curl -X DELETE http://localhost:3000/tasks/1
```

Returns the deleted task.

## Errors

Errors are always JSON with a `message`. Validation errors also have an `errors` array.

```json
{
  "message": "Invalid task data",
  "errors": ["title is required and must be a non-empty string"]
}
```

- 400 - bad body or query params, bad priority, invalid JSON, or an id that is not a positive whole number (like `/tasks/abc`)
- 404 - task not found or route not found
- 500 - something broke on the server

## Testing

Run the tests with:

```bash
npm test
```

The tests don't change `data/tasks.json`.

You can also import `postman/task-manager.postman_collection.json` into Postman and run the whole collection. Start the server first. It has a request for every endpoint and the error cases, and checks the response of each one. Run it in order because the later requests use the task created by the first one. It deletes the tasks it creates at the end, but while it runs they do get saved in `data/tasks.json`.

Or just use the curl commands above.
