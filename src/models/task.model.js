const mongoose = require("mongoose");
const validator = require("validator");
const log = console.log;

// Creating a Task Schema
const taskSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true
    },
    completed: {
      type: Boolean,
      default: false
    },
    // Adding this field to assist in creating a relationship between a user and a task
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,

      // Mongoose can help us to fetch the entire owner profile once we have access to a task
      ref: "User"
    }
  },
  {
    timestamps: true
  }
);

// Creating the Task Model
const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
