const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const User = require("../../src/models/user.model");

const userOneId = new mongoose.Types.ObjectId();

/**
 * To work with endpoints that require authentication,
 * we need to create the _id property,
 * so that we can generate a token property and the _id field for the user
 */

const userOne = {
  _id: userOneId,
  name: "Teenah",
  email: "teenah@aol.com",
  password: "56what!!",
  tokens: [
    {
      token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET)
    }
  ]
};

/**
 * Because the output of this file is going to be needed to work with endpoints
 * that require authentication, we need a function that literally
 * "Sets up the database" and provide the data that will be useful in the
 * beforeEach testing setup method.
 */

const setupDatabase = async () => {
  await User.deleteMany();
  await new User(userOne).save();
};

module.exports = {
  userOneId,
  userOne,
  setupDatabase
};
