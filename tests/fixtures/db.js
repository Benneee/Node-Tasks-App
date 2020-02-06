const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const User = require("../../src/models/user.model");
const Task = require("../../src/models/task.model");

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

const userTwoId = new mongoose.Types.ObjectId();

const userTwo = {
  _id: userTwoId,
  name: "Benneee",
  email: "benneee@aol.com",
  password: "56what!!",
  tokens: [
    {
      token: jwt.sign({ _id: userTwoId }, process.env.JWT_SECRET)
    }
  ]
};

const taskOne = {
  _id: new mongoose.Types.ObjectId(),
  description: "First task",
  completed: false,
  owner: userOne._id
};

const taskTwo = {
  _id: new mongoose.Types.ObjectId(),
  description: "Second task",
  completed: true,
  owner: userOne._id
};

const taskThree = {
  _id: new mongoose.Types.ObjectId(),
  description: "Three task",
  completed: true,
  owner: userTwo._id
};

/**
 * Because the output of this file is going to be needed to work with endpoints
 * that require authentication, we need a function that literally
 * "Sets up the database" and provide the data that will be useful in the
 * beforeEach testing setup method.
 */

const setupDatabase = async () => {
  await User.deleteMany();
  await Task.deleteMany();
  await new User(userOne).save();
  await new User(userTwo).save();
  await new Task(taskOne).save();
  await new Task(taskTwo).save();
  await new Task(taskThree).save();
};

module.exports = {
  userOneId,
  userOne,
  userTwo,
  taskOne,
  taskTwo,
  setupDatabase
};
