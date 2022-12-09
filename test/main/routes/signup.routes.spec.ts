import request from "supertest";
import { MongoHelper } from "../../../src/infra/db/mongodb/mongo-helpers";
import app from "../../../src/main/config/app";

describe('signup Routes', () => {

  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  afterEach(async () => {
    await MongoHelper.getCollection("accounts").deleteMany({});
  })

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