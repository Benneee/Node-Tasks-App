const request = require("supertest");

// Load in the server file without the listen method call
const app = require("../src/app");
/**
 * We need to wipe the database clean befor each of our tests, so we call
 * the lifecycle methods available in Jest to do this for us
 */

const User = require("../src/models/user.model");

const userOne = {
  name: "Teenah",
  email: "teenah@aol.com",
  password: "56what!!"
};

beforeEach(async () => {
  await User.deleteMany();
  await new User(userOne).save();
});

test("Should sign up a new user", async () => {
  await request(app)
    .post("/users")
    .send({
      name: "Ben Nk",
      email: "amy103@yopmail.com",
      password: "Mypass123!"
    })
    .expect(201);
});

test("Should login existing user", async () => {
  await request(app)
    .post("/users/login")
    .send({
      email: userOne.email,
      password: userOne.password
    })
    .expect(200);
});

test("Should not login nonexistent user", async () => {
  await request(app)
    .post("/users/login")
    .send({
      email: userOne.email,
      password: "Alayejorjor1."
    })
    .expect(400);
});
