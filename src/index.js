const express = require("express");
require('./db/mongoose');

const User = require('./models/user.model')
const Task = require('./models/task.model')

const log = console.log;

const app = express();
const port = process.env.PORT || 3000;

// Parse the json
app.use(express.json());

// GET users
app.post("/users", (req, res) => {
  const user = new User(req.body);

  user.save().then(() => {
      res.status(201).send(user)
  }).catch((error) => {
      res.status(400).send(error)
  })
});

app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
