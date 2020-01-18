const express = require("express");
const router = express.Router();
const multer = require("multer");
const User = require("../models/user.model");
const authMiddleware = require("../middleware/auth");

const avatar = multer({
  dest: "avatars"
});

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
    const token = await user.generateAuthToken();
    res.status(201).send({ user, token });
  } catch (error) {
    res.status(400).send(error);
  }
});

// LOGIN
router.post("/users/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateAuthToken();
    res.status(200).send({ user, token });
  } catch (error) {
    res.status(400).send(error);
  }
});

// LOGOUT
router.post("/users/logout", authMiddleware, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(token => {
      return token.token !== req.token;
    });
    await req.user.save();

    res.send("Logged out successfully");
  } catch (error) {
    res.status(500).send(error);
  }
});

// LOGOUT ALL
router.post("/users/logoutAll", authMiddleware, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.send("Logged out in all places");
  } catch (error) {
    res.status(500).send();
  }
});

// GET all users => Repurposed to fetch the logged-in user's profile
router.get("/users/me", authMiddleware, async (req, res) => {
  // try {
  //   const users = await User.find({});
  //   res.status(200).send(users);
  // } catch (error) {
  //   res.status(500).send(error);
  // }
  res.send(req.user);
});

// GET single user
// router.get("/users/:id", async (req, res) => {
//   const _id = req.params.id;

//   try {
//     const user = await User.findById(_id);
//     if (!user) {
//       return res.status(404).send("User not found!");
//     }
//     res.status(200).send(user);
//   } catch (error) {
//     res.status(500).send();
//   }
// });

// UPDATE user
router.patch("/users/me", authMiddleware, async (req, res) => {
  // If a user is trying to update a property that doesn't exist or cannot be updated(e.g: _id), we need to set up some error handling so that there can be proper communication
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
    // Because some mongoose queries bypass advanced features like the middleware, so we need to tweak the update code so that the usage of the middleware can be consistent through every method that is saving a record, this includes update

    // const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    //   new: true,
    //   runValidators: true
    // });
    // The options: 'new' will ensure the updated data is returned to us, not the old data. 'runValidators' will ensure the body of request is validated before the request is allowed to go through

    // The restructuring goes thus:
    //1. Find the user about to be updated
    // const user = await User.findById(req.user._id);
    const user = req.user;

    //2. Loop through the proposed updates and assign the values accordingly
    updates.forEach(update => (user[update] = req.body[update]));

    //3. Call the save method on the document, this then allows the middleware to deal with the record being updated as well
    await user.save();

    // We want to be sure the user being updated actually exist, hence:
    // if (!user) {
    //   return res.status(404).send("User not found!");
    // }
    res.status(200).send(user);
  } catch (error) {
    res.status(400).send(error);
  }
});

// DELETE user
router.delete("/users/me", authMiddleware, async (req, res) => {
  try {
    // const user = await User.findByIdAndDelete(req.user._id);
    // if (!user) {
    //   return res.status(404).send("User not found");
    // }
    await req.user.remove();
    res.status(200).send(`${req.user.name} deleted`);
  } catch (error) {
    res.status(400).send(error);
  }
});

// POST (Upload Avatar)
router.post("/users/me/avatar", avatar.single("avatar"), (req, res) => {
  res.status(200).send("Upload successful");
});

module.exports = router;
