import request from "supertest";
import { MongoHelper } from "../../../src/infra/db/mongodb/helpers/mongo-helper";
import app from "../../../src/main/config/app";

describe('Login Routes', () => {

  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    await (await MongoHelper.getCollection("accounts")).deleteMany({});
  })

  describe("SignUp", () => {
    test('Should return 201 on signup success', async () => {
      await request(app)
        .post("/api/signup")
        .send({
          name: "Oscar Raniz",
          email: "silverRaniz@gmail.com",
          password: "1234",
          passwordConfirmation: "1234",
        })
        .expect(201);
    });
  })

  
});