const request = require("supertest");
const { server: app } = require("../app");
const { sequelize, User, Question } = require("../models");
const { queryInterface } = sequelize;
const { signToken } = require("../helpers/jwt");

let token;
const invalidToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InVzZXIwMUBtYWlsLmNvbSIsImlkIjoxLCJpYXQiOjE2MjI2MDk2NTF9.gShAB2qaCUjlnvNuM1MBWfBVEjDGdqjWSJNMEScXIeE';
beforeAll(async () => {
  const newUser = await User.create({
    email: "haii@mail.com",
    password: "12345",
  });
  token = signToken({ id: newUser.id });
});

afterAll(async () => {
  await queryInterface.bulkDelete("Users", null, {
    restartIdentity: true,
    cascade: true,
    truncate: true,
  });
});

describe("GET /questions", () => {
  it("should be get all the questions", async () => {
    const response = await request(app)
      .get("/questions")
      .set("access_token", token);
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });

  it("should failed if invalid token", async () => {
    const response = await request(app)
      .get("/questions")
      .set("access_token", invalidToken);

    expect(response.status).toBe(401);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("message", "Invalid email/password");
  });

  it("should failed if invalid token", async () => {
    const response = await request(app)
      .get("/questions")

    expect(response.status).toBe(401);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("message", "Invalid email/password");
  });
});
