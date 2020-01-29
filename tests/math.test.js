const { calculateTip } = require("../src/math");
const { fahrenheitToCelsius } = require("../src/math");
const { celsiusToFahrenheit } = require("../src/math");
const { add } = require("../src/math");

test("Should calculate total with tip", () => {
  const total = calculateTip(10, 0.3);
  expect(total).toBe(13);
});

test("Should calculate total with default tip", () => {
  const total = calculateTip(10);
  expect(total).toBe(12.5);
});

test("Should convert 32F to 0C", () => {
  const celsiusValue = fahrenheitToCelsius(32);
  expect(celsiusValue).toBe(0);
});

test("Should convert 0C to 32F", () => {
  const fahrValue = celsiusToFahrenheit(0);
  expect(fahrValue).toBe(32);
});

// test("Should add two numbers", done => {
//   add(2, 3).then(sum => {
//     expect(sum).toBe(5);
//     done();
//   });
// });

test("Should add two numbers async/await", async () => {
  const sum = await add(10, 20);
  expect(sum).toBe(30);
});
