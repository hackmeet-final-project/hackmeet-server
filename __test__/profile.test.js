const request = require('supertest');
const app = require("../app");
const { sequelize, User } = require('../models');
const { queryInterface } = sequelize
const { signToken } = require('../helpers/jwt');

let token
const invalidToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InVzZXIwMUBtYWlsLmNvbSIsImlkIjoxLCJpYXQiOjE2MjI2MDk2NTF9.gShAB2qaCUjlnvNuM1MBWfBVEjDGdqjWSJNMEScXIeE';


beforeAll(async () => {
    const newUser = await User.create({ email: "hai@mail.com", password: "12345" })
    token = signToken({ id: newUser.id })

})

afterAll(async () => {
    await queryInterface.bulkDelete("Users", null, {
        restartIdentity: true,
        cascade: true,
        truncate: true
    })
    await queryInterface.bulkDelete("Profiles", null, {
        restartIdentity: true,
        cascade: true,
        truncate: true
    })
})

describe('POST /profiles', () => {
    it('create profile users and return 201', async () => {
        const profile = {
            firstName: "ha",
            lastName: "",
            hacktivId: "1ushqsjn",
            role: "Student",
            UserId: 1
        };
        const response = await request(app).post('/profiles').send(profile).set('access_token', token);
        expect(response.status).toBe(201);
        expect(response.body).toBeInstanceOf(Object);
        expect(response.body).toHaveProperty("firstName", profile.firstName);
        expect(response.body).toHaveProperty("UserId", expect.any(Number));
    });

    it('create profile users with invalid token and return 401', async () => {
        const profile = {
            firstName: "ha",
            lastName: "",
            hacktivId: "1ushqsjn",
            role: "Student",
            UserId: 1
        };
        const response = await request(app).post('/profiles').send(profile).set('access_token', invalidToken);
        expect(response.status).toBe(401);
        expect(response.body).toBeInstanceOf(Object);
        expect(response.body).toHaveProperty("message", "Invalid email/password");
    });

    it('get profile users', async () => {
        const response = await request(app).get('/profiles').set('access_token', token);
        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Object);
    });
});

describe("PATCH /profiles", () => {
    const body = {
        input: "+20"
    }

    it("should update mmr profile if input is '+20' and return 200", async () => {
        const response = await request(app).patch("/profiles").send(body).set("access_token", token);
        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Object);
        expect(response.body).toHaveProperty("message", "MMR updated");
    });

    it("should update mmr profile if input is '-10' and return 200", async () => {
        body.input = "-10";
        const response = await request(app).patch("/profiles").send(body).set("access_token", token);
        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Object);
        expect(response.body).toHaveProperty("message", "MMR updated");
    });

    it("should update mmr profile if input is '-20' and return 200", async () => {
        body.input = "-20";
        const response = await request(app).patch("/profiles").send(body).set("access_token", token);
        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Object);
        expect(response.body).toHaveProperty("message", "MMR updated");
    });

    it("should failed if input is empty and return 401", async () => {
        body.input = "";
        const response = await request(app).patch("/profiles").send(body).set("access_token", token);
        expect(response.status).toBe(401);
        expect(response.body).toBeInstanceOf(Object);
        expect(response.body).toHaveProperty("message", "Invalid input");
    });

    it("should failed if input is null and return 401", async () => {
        delete body.input;
        const response = await request(app).patch("/profiles").send(body).set("access_token", token);
        expect(response.status).toBe(401);
        expect(response.body).toBeInstanceOf(Object);
        expect(response.body).toHaveProperty("message", "Invalid input");
    });

    it("should failed if input is wrong input and return 401", async () => {
        body.input = "wrong input";
        const response = await request(app).patch("/profiles").send(body).set("access_token", token);
        expect(response.status).toBe(401);
        expect(response.body).toBeInstanceOf(Object);
        expect(response.body).toHaveProperty("message", "Invalid input");
    });

    it("should failed if input is wrong input and return 401", async () => {
        body.input = "wrong input";
        const response = await request(app).patch("/profiles").send(body).set("access_token", invalidToken);
        expect(response.status).toBe(401);
        expect(response.body).toBeInstanceOf(Object);
        expect(response.body).toHaveProperty("message", "Invalid email/password");
    });
});