require("../db/mongoose");
const User = require("../models/user.model");

const log = console.log;

const updateAgeandCount = async (id, age) => {
  const user = await User.findByIdAndUpdate(id, { age });
  const count = await User.countDocuments({ age });

  return count;
};

updateAgeandCount("5e158a9f01e0635b66f9a7a6", 27)
  .then(count => {
    log(count);
  })
  .catch(error => {
    log(error);
  });
