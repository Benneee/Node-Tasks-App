const request = require("supertest");
const Task = require("../src/models/task.model");
const app = require("../src/app");

// With the two lines below, we now have access to the
// user created in the DB for the test purpose
const {
  userOne,
  userOneId,
  userTwo,
  taskOne,
  taskTwo,
  taskThree,
  setupDatabase
} = require("./fixtures/db");
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

test("Should get task for a particular user", async () => {
  const response = await request(app)
    .get("/tasks")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);

  expect(response.body.length).toEqual(2);
});

test("Should not delete another user's task", async () => {
  await request(app)
    .delete(`/tasks/${taskOne._id}`)
    .set("Authorization", `Bearer ${userTwo.tokens[0].token}`)
    .send()
    .expect(404);

  const task = await Task.findById(taskOne._id);
  expect(task).not.toBeNull();
});

test("Should not create task with invalid description", async () => {
  await request(app)
    .post("/tasks")
    .set("Authorization", `Bearer ${userTwo.tokens[0].token}`)
    .send({
      description: ""
    })
    .expect(400);
});

test("Should not create task with invalid completed value", async () => {
  await request(app)
    .post("/tasks")
    .set("Authorization", `Bearer ${userTwo.tokens[0].token}`)
    .send({
      description: "Do stuff",
      completed: "do stuff again"
    })
    .expect(400);
});

test("Should delete task", async () => {
  await request(app)
    .delete(`/tasks/${taskThree._id}`)
    .set("Authorization", `Bearer ${userTwo.tokens[0].token}`)
    .send()
    .expect(200);
});

test("Should not delete task if unauthenticated", async () => {
  await request(app)
    .delete(`/tasks/${taskOne._id}`)
    .send()
    .expect(401);
});

test("Should not update other user's task", async () => {
  await request(app)
    .patch(`/tasks/${taskTwo._id}`)
    .set("Authorization", `Bearer ${userTwo.tokens[0].token}`)
    .send({
      description: "do stuff"
    })
    .expect(404);
});

test("Should fetch user's task by id", async () => {
  await request(app)
    .get(`/tasks/${taskOne._id}`)
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);
});

test("Should not fetch user's task by id if unauthenticated", async () => {
  await request(app)
    .get(`/tasks/${taskOne._id}`)
    .send()
    .expect(401);
});

test("Should not fetch user's task by id", async () => {
  await request(app)
    .get(`/tasks/${taskOne._id}`)
    .set("Authorization", `Bearer ${userTwo.tokens[0].token}`)
    .send()
    .expect(404);
});

test("Should only fetch completed tasks", async () => {
  const response = await request(app)
    .get("/tasks?completed=true")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);

  expect(response.body.length).toEqual(1);
});

test("Should only fetch incompleted tasks", async () => {
  const response = await request(app)
    .get("/tasks?completed=false")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);

  expect(response.body.length).toEqual(1);
});
