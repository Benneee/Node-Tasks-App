const express = require("express");
require("./db/mongoose");

const User = require("./models/user.model");
const Task = require("./models/task.model");

const log = console.log;

const app = express();
const port = process.env.PORT || 3000;

// Parse the json
app.use(express.json());

// POST (create) users
app.post("/users", (req, res) => {
  /**
   * Expects the format:
   * {
   *    name: string
   *    email: string
   *    password: string
   *    age: number
   * }
   */
  const user = new User(req.body);

  user
    .save()
    .then(() => {
      res.status(201).send(user);
    })
    .catch(error => {
      res.status(400).send(error);
    });
});

// GET all users
app.get("/users", (req, res) => {
  User.find({})
    .then(users => {
      res.status(200).send(users);
    })
    .catch(error => {
      res.status(500).send(error);
    });
});

// GET single user
app.get("/users/:id", (req, res) => {
  const _id = req.params.id;
  User.findById(_id)
    .then(user => {
      if (!user) {
        return res.status(404).send();
      }
      res.status(200).send(user);
    })
    .catch(error => {
      res.status(500).send();
    });
});

// POST (create) tasks
app.post("/tasks", (req, res) => {
  /**
   * Expects task format:
   * {
   *   description: string
   *   completed: boolean
   * }
   */
  const task = new Task(req.body);

  task
    .save()
    .then(() => {
      res.status(201).send(task);
    })
    .catch(error => {
      res.status(400).send(error);
    });
});

// GET all tasks
app.get("/tasks", (req, res) => {
  Task.find({})
    .then(tasks => {
      res.status(200).send(tasks);
    })
    .catch(error => {
      res.status(500).send(error);
    });
});

// GET single task
app.get("/tasks/:id", (req, res) => {
  const taskID = req.params.id;
  Task.findById(taskID)
    .then(task => {
      if (!task) {
        return res.status(404).send("Task not found!");
      }
      res.status(200).send(task);
    })
    .catch(error => res.status(500).send(error));
});

app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
