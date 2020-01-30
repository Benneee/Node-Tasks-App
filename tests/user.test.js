const request = require("supertest");

// Load in the server file without the listen method call
const app = require("../src/app");

test("Should sign up a new user", async () => {
  await request(app)
    .post("/users")
    .send({
      name: "Ben Yedder",
      email: "amy103@yopmail.com",
      password: "Mypass123!"
    })
    .expect(201);
});
