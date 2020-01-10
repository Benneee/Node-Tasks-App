const mongoose = require("mongoose");
const log = console.log;

const mongodb =
  "mongodb+srv://benedict:rocket18@cluster0-8azdb.mongodb.net/tasks?retryWrites=true&w=majority";

mongoose
  .connect(mongodb, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true, // Helps us to quickly access the data from the DB
    useFindAndModify: false
  })
  .then(() => log("Connected to MongoDB..."))
  .catch(error => log(error));
