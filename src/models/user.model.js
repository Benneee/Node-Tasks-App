const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Task = require("../models/task.model");
const log = console.log;

// For us to be able to use middleware, we use the schema to hold the expected data for a user
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"], // Inbuilt validation with an error message
    trim: true
  },
  email: {
    type: String,
    required: [true, "Email address is required"],
    unique: true, // To ensure we don't have the same email address for two users
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
  },
  // We need to store the token generated for the user to enable them logout from their account
  tokens: [
    {
      token: {
        type: String,
        required: [true, "No authentication token"]
      }
    }
  ]
}, {
  timestamps: true
}
);

// Virtual to fetch tasks belonging to a user
userSchema.virtual("tasks", {
  ref: "Task",
  localField: "_id",
  foreignField: "owner"
});

// Custom method to share only the necessary profile information
userSchema.methods.toJSON = function() {
  const user = this;
  const userObject = user.toObject();
  delete userObject.password;
  delete userObject.tokens;

  return userObject;
};

// Custom method to generate auth token
userSchema.methods.generateAuthToken = async function() {
  // First, we get the instance of the user
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, "anewknowledge");
  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
};

// Custon method to validate user on login
userSchema.statics.findByCredentials = async (email, password) => {
  // First, find the user by the email
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("Unable to login");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Unable to login");
  }
  return user;
};

// The method to introduce middleware into our model
userSchema.pre("save", async function(next) {
  // Cannot be an arrow function because we need the 'this' binding
  const user = this;
  // In this zone, we get access to the user document just before it is save to the DB
  // Hence, we can hash the password right here
  // log("password: ", user.password);

  // So we only want to hash the password if it was changed
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
    // We use 8 for the number of rounds of salting because it gives us a fine balance in speed and security.
    // Speed: so that the locking doesn't keep our saving process for too long
    // Security: because it is quite difficult to crack this level of hashing
    // Plus 8 was recommended by the creator of the bcrypt library in the first place
  }

  next();
  // We call next so that the control will be passed back to the process saving the user to the DB
});

// Middleware to delete user tasks when user is removed
userSchema.pre("remove", async function(next) {
  const user = this;
  await Task.deleteMany({ owner: user._id });
  next();
});

//   Creating the User Model
const User = mongoose.model("User", userSchema);

module.exports = User;
