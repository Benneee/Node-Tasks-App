const request = require("supertest");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
// Load in the server file without the listen method call
const app = require("../src/app");
/**
 * We need to wipe the database clean befor each of our tests, so we call
 * the lifecycle methods available in Jest to do this for us
 */

/**
 * To work with endpoints that require authentication,
 * we need to create the _id property,
 * so that we can generate a token property and the _id field for the user
 */
const User = require("../src/models/user.model");

const userOneId = new mongoose.Types.ObjectId();

const userOne = {
  _id: userOneId,
  name: "Teenah",
  email: "teenah@aol.com",
  password: "56what!!",
  tokens: [
    {
      token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET)
    }
  ]
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

test("Should get profile for user", async () => {
  await request(app)
    .get("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);
});

test("Should not get profile for unauthenticated user", async () => {
  await request(app)
    .get("/users/me")
    .send()
    .expect(401);
});

// test("Should delete account for user")
