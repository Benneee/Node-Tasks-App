const mongoose = require("mongoose");
const validator = require("validator");
const log = console.log;

// Creating the Task Model
const Task = mongoose.model("Task", {
  description: {
    type: String,
    required: [true, "Description is required"],
    trim: true
  },
  completed: {
    type: Boolean,
    default: false
  }
});

module.exports = Task;
