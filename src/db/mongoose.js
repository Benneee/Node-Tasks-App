const mongoose = require("mongoose");
const validator = require("validator");
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
    type: String,
    required: [true, "Name is required"], // Inbuilt validation with an error message
    trim: true
  },
  email: {
    type: String,
    required: [true, "Email address is required"],
    trim: true,
    lowercase: true,
    //   Using the validator library
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Email address is invalid");
      }
    }
  },
  age: {
    type: Number,
    // Custom validation
    // Using the es6 syntax for object method
    default: 0,
    validate(value) {
      if (value < 0) {
        throw new Error("Age must be a positive number");
      }
    }
  },
  password: {
    type: String,
    minlength: [7, "Password must be at least 7 characters"],
    required: [true, "Password is required"],
    trim: true,
    validate(value) {
      if (value.toLowerCase().includes("password")) {
        throw new Error("Password cannot contain 'password'");
      }
    }
  }
});

// Create an instance of a user
// const user = new User({
//   name: " Ik   ",
//   age: 28,
//   email: "BENEDICT_NK@AOL.COM",
//   password: "hello"
// });

// This saves the user to the DB
// user
//   .save()
//   .then(() => {
//     log("user added: ", user);
//     // In the data returned, '__v' stands for the version of the document
//   })
//   .catch(error => {
//     log("Error: ", error);
//   });

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

// Creating an instance of a task

// const task = new Task({
//   description: "Cinema trip",
//   completed: true
// });

// task
//   .save()
//   .then(() => log("task added: ", task))
//   .catch(error => log("error: ", error));
