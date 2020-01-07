const mongoose = require("mongoose");
const cors = require("cors");
const express = require("express");
const bodyParser = require("body-parser");
const log = console.log;

const app = express();
const port = process.env.PORT || 3000;
const router = express.Router();

app.use(cors());

app.options("*", cors());

app.use(bodyParser.json());

app.use(express.urlencoded({ extended: false }));

app.use("/", router);

const mongodb =
  "mongodb+srv://benedict:rocket18@cluster0-8azdb.mongodb.net/tasks?retryWrites=true&w=majority";

mongoose
  .connect(mongodb, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => log("Connecting to MongoDB..."))
  .catch(err => log(err));

const connection = mongoose.connection;

connection.once("open", () => log("Connection to DB successful!"));

app.listen(port, () => log(`Listening on port ${port}`));
