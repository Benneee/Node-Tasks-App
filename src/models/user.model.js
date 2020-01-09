const mongoose = require("mongoose");
const validator = require("validator");
const log = console.log;

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

module.exports = User;
