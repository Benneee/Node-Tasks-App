const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");

const Task = require("../models/task.model");

// POST (create) tasks
router.post("/tasks", authMiddleware, async (req, res) => {
  /**
   * Expects task format:
   * {
   *   description: string
   *   completed: boolean
   * }
   */
  // const task = new Task(req.body);

  // We append the owner property before we create a task
  const task = new Task({
    ...req.body,
    owner: req.user._id
  });
  try {
    await task.save();
    res.status(201).send(task);
  } catch (error) {
    res.status(400).send(error);
  }
});

// GET all tasks
router.get("/tasks", authMiddleware, async (req, res) => {
  try {
    // I could also search by the 'owner' key
    await req.user.populate("tasks").execPopulate();
    res.send(req.user.tasks);
  } catch (error) {
    res.status(500).send(error);
  }
});

// GET single task
router.get("/tasks/:id", authMiddleware, async (req, res) => {
  const taskID = req.params.id;
  try {
    // const task = await Task.findById(taskID);
    // To make sure this task being fetched was created by the user trying to fetch
    const task = await Task.findOne({ _id: taskID, owner: req.user._id });
    // console.log("t: ", task);
    if (!task) {
      return res.status(404).send("Task not found!");
    }
    res.status(200).send(task);
  } catch (error) {
    res.status(500).send(error);
  }
});

// UPDATE task
router.patch("/tasks/:id", authMiddleware, async (req, res) => {
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
    // const task = await Task.findById(_id);
    const task = await Task.findOne({
      _id: req.params.id,
      owner: req.user._id
    });
    if (!task) {
      return res.status(404).send("Task not found!");
    }

    updates.forEach(update => (task[update] = req.body[update]));
    await task.save();

    res.status(200).send(task);
  } catch (error) {
    res.status(500).send(error);
  }
});

// DELETE task
router.delete("/tasks/:id", authMiddleware, async (req, res) => {
  try {
    // const task = await Task.findByIdAndDelete(req.params.id);
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id
    });

    if (!task) {
      return res.status(404).send("Task not found!");
    }
    res.status(200).send(`${task.description} deleted`);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
