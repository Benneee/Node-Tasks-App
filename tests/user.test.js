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

// test("Should sign up a new user", async () => {
//   const response = await request(app)
//     .post("/users")
//     .send({
//       name: "Ben Nk",
//       email: "amy103@yopmail.com",
//       password: "Mypass123!"
//     })
//     .expect(201);

// Assert that the database was changed correctly
// const user = await User.findById(response.body.user._id);
// expect(user).not.toBeNull();

// Assertions about the response object
// expect(response.body).toMatchObject({
//   user: {
//     name: "Ben Nk",
//     email: "amy103@yopmail.com"
//   },
//   token: user.tokens[0].token
// });

// Assertion about the user password - ensure it's not saved as plain text
// expect(user.password).not.toBe("Mypass123!");
// });

test("Should login existing user", async () => {
  const response = await request(app)
    .post("/users/login")
    .send({
      email: userOne.email,
      password: userOne.password
    })
    .expect(200);

  const user = await User.findById(userOne._id);

  // Assert that token in DB is token created after user logs in
  expect(response.body.token).toBe(user.tokens[1].token);
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

test("Should delete account for user", async () => {
  await request(app)
    .delete("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);

  const user = await User.findById(userOne._id);
  expect(user).toBeNull();
});

test("Should not delete account for unauthenticated user", async () => {
  await request(app)
    .delete("/users/me")
    .send()
    .expect(401);
});

// 401: "unauthorised"

test("Should upload avatar image", async () => {
  await request(app)
    .post("/users/me/avatar")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .attach("avatar", "tests/fixtures/profile-pic.jpg")
    .expect(200);

  const user = await User.findById(userOneId);
  expect(user.avatar).toEqual(expect.any(Buffer));
});

test("Should update valid user fields", async () => {
  await request(app)
    .patch("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({
      name: "Ola"
    })
    .expect(200);

  const user = await User.findById(userOneId);
  expect(user.name).toBe("Ola");
});

test("Should not update valid user fields", async () => {
  await request(app)
    .patch("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({
      address: "Kano"
    })
    .expect(400);
});
