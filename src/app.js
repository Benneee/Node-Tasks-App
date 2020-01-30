// To be used without calling the express' listen method, because of the test cases
const express = require("express");
require("./db/mongoose");

const app = express();

const userRouter = require("./routes/user.route");
const taskRouter = require("./routes/task.route");

// Middleware: new request -> do stuff -> run route handler
// Registering a middleware
// app.use((req, res, next) => {
//   res.status(503).send("Site under maintenance, please check back later");
// });

app.get("/", (req, res) => res.send("Welcome to the Tasks App API Page!"));

// Parse the json
app.use(express.json()); // No need for body-parser

// This activates the router object for our use
app.use(userRouter);
app.use(taskRouter);

module.exports = app;
