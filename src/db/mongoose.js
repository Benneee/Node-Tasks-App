const mongoose = require("mongoose");
const log = console.log;

const mongodb = process.env.MONGODB_URL;

mongoose
  .connect(mongodb, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true, // Helps us to quickly access the data from the DB
    useFindAndModify: false
  })
  .then(() => log("Connected to MongoDB..."))
  .catch(error => log(error));
