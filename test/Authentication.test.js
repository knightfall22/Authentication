const sinon = require("sinon");
const jwt = require("jsonwebtoken");
const request = require("supertest");
const mongoose = require("mongoose");

const app = require("../app");

const authMiddleware = require("../middleware/is-auth");
const User = require("../models/User");

describe("Middleware functionality", () => {
  it("Should Throw error if no authorization header", () => {
    const req = {
      get: function (headerName) {
        return null;
      },
    };

    expect(authMiddleware.bind(this, req, {}, () => {})).toThrow();
  });

  it("Should fail if authorization header is invalid", () => {
    const req = {
      get: function (headerName) {
        return "Bearer 123";
      },
    };
    expect(authMiddleware.bind(this, req, {}, () => {})).toThrow();
  });

  it("Should pass if authorization header is valid", () => {
    const req = {
      get: function (headerName) {
        return "Bearer 123";
      },
    };

    sinon.stub(jwt, "verify");
    jwt.verify.returns({
      userId: "123",
    });
    authMiddleware(req, {}, () => {});
    expect(req).toHaveProperty("userId");
    sinon.restore();
  });
});

describe("Authentication Logic", () => {
  const user = {
    name: "test",
    email: "test@example.com",
    password: "123456",
    confirmPassword: "123456",
  };

  describe("User Creation Logic", () => {
    it("should return validation error when req.body empty", async () => {
      const response = await request(app).post("/api/auth/signup").send({});
      expect(response.status).toBe(400);
    });

    it("should create a user successfully", async () => {
      const response = await request(app).post("/api/auth/signup").send(user);

      expect(response.status).toBe(201);
      expect(response.body.message).toBe("User created successfully");
    });

    it("should return error if user exists", async () => {
      const response = await request(app).post("/api/auth/signup").send(user);
      expect(response.status).toBe(409);
      expect(response.body.message).toBe("User already exists");
    });
  });

  describe("Login Logic", () => {
    let token;

    it("should return validation error when req.body empty", async () => {
      const response = await request(app).post("/api/auth/signin").send({});
      expect(response.status).toBe(400);
    });

    it("should return error if user does not exist", async () => {
      const response = await request(app).post("/api/auth/signin").send({
        email: "tes@example.com",
        password: "123456",
      });
      expect(response.status).toBe(404);
    });

    it("should return token if successful", async () => {
      const response = await request(app).post("/api/auth/signin").send({
        email: user.email,
        password: user.password,
      });

      token = response.body.token;
      expect(response.body.message).toBe("User logged in successfully");
      expect(response.body.token).toBeDefined();
      expect(response.body.user).toBeDefined();
    });

    it("should return user profile", async () => {
      const response = await request(app)
        .get("/api/auth/get-profile")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("User profile fetched successfully");
      expect(response.body.user).toBeDefined();
    });
  });

  describe("Reset Password logic", () => {
    let resetToken;
    it("should return validation error when req.body empty", async () => {
      const response = await request(app)
        .post("/api/auth/password-reset")
        .send({});
      expect(response.status).toBe(400);
    });

    it("should return error if user does not exist", async () => {
      const response = await request(app)
        .post("/api/auth/password-reset")
        .send({
          email: "tes@example.com",
        });
      expect(response.status).toBe(404);
    });

    
    it("should return login token", async () => {
        const response = await request(app)
        .post("/api/auth/password-reset")
        .send({
            email: user.email,
        });
        
        resetToken = response.body.passwordResetToken;
        expect(response.status).toBe(200);
        expect(response.body.passwordResetToken).toBeDefined();
    });
    
    it('should return error if reset limit exceeded', async () => {

        const numberOfRequests = 10;
        let finalResponse;
    
        for (let i = 0; i < numberOfRequests; i++) {
            const response = await request(app)
            .post("/api/auth/password-reset")
            .send({
              email: user.email,
            });
          finalResponse = response;
        }
        expect(finalResponse.status).toBe(429)
        expect(finalResponse.body.message).toBe('Too many attempts try again in 6 hours');

        const test = await User.findOne({email: user.email})
        resetToken = test.reset.resetToken;
        console.log(test);
    })

    it("should change password", async () => {
      const response = await request(app).post("/api/auth/new-password").send({
        token: resetToken,
        password: "newPassword",
        confirmPassword: "newPassword",
      });

      console.log(response.body);
      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Password changed successfully");
    });



    it("return error if token is expired", async () => {
      await User.findOneAndUpdate(
        { email: user.email },
        {
          reset: {
            resetTokenExpires: new Date() + 1000000000,
          },
        },
        { new: true }
      );

      const response = await request(app).post("/api/auth/new-password").send({
        token: resetToken,
        password: "newPassword",
        confirmPassword: "newPassword",
      });

      expect(response.body.message).toBe("Invalid token or user");
    });



  });

  afterAll(async () => {
    // Delete all data from collections in your MongoDB database
    await User.deleteMany({});
  });
});
