const express = require("express");
require("./db/mongoose");

const app = express();
const port = process.env.PORT || 3000;

const userRouter = require("./routes/user.route");
const taskRouter = require("./routes/task.route");

// Middleware: new request -> do stuff -> run route handler
// Registering a middleware
app.use((req, res, next) => {
  console.log(req.method, req.path);
  next(); // This method hands over control to the route handler to continue
});

// Parse the json
app.use(express.json()); // No need for body-parser

// This activates the router object for our use
app.use(userRouter);
app.use(taskRouter);

app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
