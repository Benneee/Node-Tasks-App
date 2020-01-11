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
app.post("/users", async (req, res) => {
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

  // Using a try-catch block
  try {
    await user.save();
    res.status(201).send(user);
  } catch (error) {
    res.status(400).send(error);
  }
});

// GET all users
app.get("/users", async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).send(users);
  } catch (error) {
    res.status(500).send(error);
  }
});

// GET single user
app.get("/users/:id", async (req, res) => {
  const _id = req.params.id;

  try {
    const user = await User.findById(_id);
    if (!user) {
      return res.status(404).send("User not found!");
    }
    res.status(200).send(user);
  } catch (error) {
    res.status(500).send();
  }
});

// UPDATE user
app.patch("/users/:id", async (req, res) => {
  // If a user is trying to update a property that doesn't exist or cannot be uodated(e.g: _id), we need to set up some error handling so that there can be proper communication
  const updates = Object.keys(req.body); // Returns an array of the keys of the body
  // Fields allowed to be updated
  const allowedUpdates = ["name", "age", "email", "password"];
  const isValidUpdateOperation = updates.every(update =>
    allowedUpdates.includes(update)
  );
  if (!isValidUpdateOperation) {
    return res.status(400).send({ error: "Invalid update!" });
  }
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    // The options: 'new' will ensure the updated data is returned to us, not the old data. 'runValidators' will ensure the body of request is validated before the request is allowed to go through

    // We want to be sure the user being updated actually exist, hence:
    if (!user) {
      return res.status(404).send("User not found!");
    }
    res.status(200).send(user);
  } catch (error) {
    res.status(400).send(error);
  }
});

// POST (create) tasks
app.post("/tasks", async (req, res) => {
  /**
   * Expects task format:
   * {
   *   description: string
   *   completed: boolean
   * }
   */
  const task = new Task(req.body);
  try {
    await task.save();
    res.status(201).send(task);
  } catch (error) {
    res.status(400).send(error);
  }
});

// GET all tasks
app.get("/tasks", async (req, res) => {
  try {
    const tasks = await Task.find({});
    res.status(200).send(tasks);
  } catch (error) {
    res.status(500).send(error);
  }
});

// GET single task
app.get("/tasks/:id", async (req, res) => {
  const taskID = req.params.id;
  try {
    const task = await Task.findById(taskID);
    if (!task) {
      return res.status(404).send("Task not found!");
    }
    res.status(200).send(task);
  } catch (error) {
    res.status(500).send(error);
  }
});

// UPDATE task
app.patch("/tasks/:id", async (req, res) => {
  // To handle unwanted updates
  const updates = Object.keys(req.body);
  const allowedUpdates = ["description", "completed"];
  const isValidUpdateOperation = updates.every(update =>
    allowedUpdates.includes(update)
  );

  if (!isValidUpdateOperation) {
    return res.status(400).send("Invalid update");
  }
  const _id = req.params.id;
  try {
    const task = await Task.findByIdAndUpdate(_id, req.body, {
      new: true,
      runValidators: true
    });
    if (!task) {
      return res.status(404).send("Task not found!");
    }
    res.status(200).send(task);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
