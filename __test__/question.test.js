const request = require("supertest");
const app = require("../app");
const { sequelize, User, Question } = require("../models");
const { queryInterface } = sequelize;
const { signToken } = require("../helpers/jwt");

let token;

beforeAll(async () => {
  const newUser = await User.create({
    email: "hai@mail.com",
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
  await queryInterface.bulkDelete("Questions", null, {
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
});
