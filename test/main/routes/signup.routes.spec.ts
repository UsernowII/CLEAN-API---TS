import request from "supertest";
import app from "../../../src/main/config/app";

describe('signup Routes', () => {
  test('Should return an account on success', async () => {
    await request(app)
      .post("/api/signup")
      .send({
        name: "Oscar Raniz",
        email: "silverRaniz@gmail.com",
        password: "1234",
        passwordConfirmation: "1234",
      })
      .expect(200)
      .expect({ok : 200 });
  });
});