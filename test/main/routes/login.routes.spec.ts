import { Collection } from "mongodb";
import { hash } from "bcrypt";
import request from "supertest";
import app from "../../../src/main/config/app";
import { MongoHelper } from "../../../src/infra/db/mongodb/helpers/mongo-helper";

let accountCollection: Collection;

describe('Login Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection("accounts");
    await accountCollection.deleteMany({})

  })

  describe("SignUp / POST", () => {
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
  });

  describe("Login / POST", () => {
    test('Should return 401 on login fail', async () => {
      const password = await hash("1234", 12)
      await accountCollection.insertOne({
        name: "Oscar Raniz",
        email: "bronceRaniz@gmail.com",
        password: password,
      });
      await request(app)
        .post("/api/login")
        .send({
          email: "bronceRaniz@gmail.com",
          password: "123",
        })
        .expect(401);
    });
  });


});
