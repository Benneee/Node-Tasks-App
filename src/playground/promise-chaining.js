require("../../src/db/mongoose");
const User = require("../models/user.model");
const log = console.log;

// Implementing Promise Chaining
// Update a user's age and return all the users with that same age in one call

const _id = "5e16a03b66e0281ebf5cd3d6";
User.findByIdAndUpdate({ _id }, { age: 28 })
  .then(user => {
    log(user);
    return User.countDocuments({ age: 28 });
  })
  .then(number => {
    log(number);
  })
  .catch(error => log(error));
