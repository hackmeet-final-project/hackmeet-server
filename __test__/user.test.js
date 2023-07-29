const request = require("supertest");
const app = require("../app");
const { hashPassword } = require("../helpers/bcrypt");
const { sequelize } = require("../models");

beforeAll(async () => {
  await sequelize.queryInterface.bulkInsert("Users", [
    {
      email: "cust1@mail.com",
      password: hashPassword("12345"),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      email: "cust2@mail.com",
      password: hashPassword("12345"),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);
});

afterAll(async () => {
  await sequelize.queryInterface.bulkDelete("Users", null, {
    restartIdentity: true,
    cascade: true,
    truncate: true,
  });
});

describe("POST /users", () => {
  it("create new customer and return 201", async () => {
    const cust = {
      email: "hay@mail.com",
      password: "12345",
    };
    const response = await request(app).post("/users").send(cust);
    expect(response.status).toBe(201);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("email", cust.email);
    expect(response.body).toHaveProperty("userId", expect.any(Number));
  });

  it("password is empty and return 400", async () => {
    const cust = {
      email: "hay@mail.com",
      password: "",
    };
    const response = await request(app).post("/users").send(cust);
    expect(response.status).toBe(400);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("message", "Password is required");
  });

  it("Email is empty and return 400", async () => {
    const cust = {
      email: "",
      password: "12345",
    };
    const response = await request(app).post("/users").send(cust);
    expect(response.status).toBe(400);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("message", "Email is required");
  });

  it("email is not email format and return 400", async () => {
    const cust = {
      username: "hay",
      email: "hayyyy",
      password: "12345",
    };
    const response = await request(app).post("/users").send(cust);
    expect(response.status).toBe(400);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("message", "Invalid email format");
  });

  it("password isnull and return 400", async () => {
    const cust = {
      email: "hay@mail.com",
    };
    const response = await request(app).post("/users").send(cust);
    expect(response.status).toBe(400);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("message", "Password is required");
  });

  it("email isnull and return 400", async () => {
    const cust = {
      password: "12345",
    };
    const response = await request(app).post("/users").send(cust);
    expect(response.status).toBe(400);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("message", "Email is required");
  });

  it("email is not unique and return 400", async () => {
    const cust = {
      email: "hay@mail.com",
      password: "12345",
    };
    const response = await request(app).post("/users").send(cust);
    expect(response.status).toBe(400);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("message", "Email already registered");
  });
});

describe("POST /cust/login", () => {
  it("customer login and return 200", async () => {
    const cust = {
      email: "hay@mail.com",
      password: "12345",
    };
    const response = await request(app).post("/users/login").send(cust);
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("access_token", expect.any(String));
  });

  it("password does not match and return 401", async () => {
    const cust = {
      email: "hay@mail.com",
      password: "123456",
    };
    const response = await request(app).post("/users/login").send(cust);
    expect(response.status).toBe(401);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("message", "Invalid email/password");
  });

  it("email has not been registered and return 401", async () => {
    const cust = {
      email: "hayyy123@mail.com",
      password: "12345",
    };
    const response = await request(app).post("/users/login").send(cust);
    expect(response.status).toBe(401);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("message", "Invalid email/password");
  });
});
