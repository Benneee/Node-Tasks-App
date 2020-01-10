require("../db/mongoose");
const Task = require("../models/task.model");
const log = console.log;

const _id = "5e15903caf656a5e4ebd035c";
Task.findByIdAndDelete(_id)
  .then(task => {
    log(task);
    return Task.countDocuments({ completed: false });
  })
  .then(number => {
    log(number);
  })
  .catch(error => log(error));
