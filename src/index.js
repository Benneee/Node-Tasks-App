const express = require("express");
require("./db/mongoose");

const app = express();
const port = process.env.PORT || 3000;

const userRouter = require("./routes/user.route");
const taskRouter = require("./routes/task.route");

// Middleware: new request -> do stuff -> run route handler
// Registering a middleware
// app.use((req, res, next) => {
//   res.status(503).send("Site under maintenance, please check back later");
// });

// Parse the json
app.use(express.json()); // No need for body-parser

// This activates the router object for our use
app.use(userRouter);
app.use(taskRouter);

app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
