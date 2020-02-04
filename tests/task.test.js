const request = require("supertest");
const Task = require("../src/models/task.model");
const app = require("../src/app");

// With the two lines below, we now have access to the
// user created in the DB for the test purpose
const { userOne, userOneId, setupDatabase } = require("./fixtures/db");
beforeEach(setupDatabase);

test("Should create task for user", async () => {
  const response = await request(app)
    .post("/tasks")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({
      description: "From test file"
    })
    .expect(201);

  const task = await Task.findById(response.body._id);
  expect(task.description).toEqual("From test file");
  expect(task).not.toBeNull();
  expect(task.completed).toEqual(false);
});
