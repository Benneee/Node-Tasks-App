const express = require("express");
const router = express.Router();

const Task = require("../models/task.model");

// POST (create) tasks
router.post("/tasks", async (req, res) => {
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
router.get("/tasks", async (req, res) => {
  try {
    const tasks = await Task.find({});
    res.status(200).send(tasks);
  } catch (error) {
    res.status(500).send(error);
  }
});

// GET single task
router.get("/tasks/:id", async (req, res) => {
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
router.patch("/tasks/:id", async (req, res) => {
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
    // const task = await Task.findByIdAndUpdate(_id, req.body, {
    //   new: true,
    //   runValidators: true
    // });

    // In case we need to use a middleware on the task
    const task = await Task.findById(_id);

    updates.forEach(update => (task[update] = req.body[update]));
    await task.save();
    if (!task) {
      return res.status(404).send("Task not found!");
    }
    res.status(200).send(task);
  } catch (error) {
    res.status(500).send(error);
  }
});

// DELETE task
router.delete("/tasks/:id", async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      return res.status(404).send("Task not found!");
    }
    res.status(200).send(`${task.description} deleted`);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
