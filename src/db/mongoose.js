const mongoose = require("mongoose");
const log = console.log;

const mongodb =
  "mongodb+srv://benedict:rocket18@cluster0-8azdb.mongodb.net/tasks?retryWrites=true&w=majority";

mongoose
  .connect(mongodb, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true // Helps us to quickly access the data from the DB
  })
  .then(() => log("Connected to MongoDB..."))
  .catch(error => log(error));

//   Creating the User Model
const User = mongoose.model("User", {
  name: {
    type: String
  },
  age: {
    type: Number
  }
});

// Creating the Task Model
const Task = mongoose.model("Task", {
  description: {
    type: String
  },
  completed: {
    type: Boolean
  }
});

// Create an instance of a user
// const me = new User({
//   name: "Benedict",
//   age: 27
// });

// This saves the user to the DB
// me.save()
//   .then(() => {
//     log("user added: ", me);
//     // In the data returned, '__v' stands for the version of the document
//   })
//   .catch(error => {
//     log("Error: ", error);
//   });

// Creating an instance of a task

// const firstTask = new Task({
//   description: "Do laundry",
//   completed: false
// });

// firstTask
//   .save()
//   .then(() => log("task added: ", firstTask))
//   .catch(error => log("error: ", error));
