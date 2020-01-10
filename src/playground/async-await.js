require("../db/mongoose");
const Task = require("../models/task.model");

const log = console.log;

const deleteTaskAndCount = async (id, completed) => {
  const task = await Task.findByIdAndDelete(id);
  const count = await Task.countDocuments({ completed });

  return count;
};

deleteTaskAndCount("5e15541f5534144e987535a9", false)
  .then(count => log(count))
  .catch(error => log(error));
