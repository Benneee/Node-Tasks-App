const express = require("express");
const router = express.Router();
const User = require("../models/user.model");

// POST (create) users
router.post("/users", async (req, res) => {
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
router.get("/users", async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).send(users);
  } catch (error) {
    res.status(500).send(error);
  }
});

// GET single user
router.get("/users/:id", async (req, res) => {
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
router.patch("/users/:id", async (req, res) => {
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

// DELETE user
router.delete("/users/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).send("User not found");
    }
    res.status(200).send(`${user.name} deleted`);
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;
