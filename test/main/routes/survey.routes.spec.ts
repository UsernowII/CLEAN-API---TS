import { Collection, ObjectId } from "mongodb";
import { sign } from "jsonwebtoken";
import request from "supertest";

import app from "../../../src/main/config/app";
import { MongoHelper } from "../../../src/infra/db/mongodb/helpers/mongo-helper";
import env from "../../../src/main/config/env";

let surveyCollection: Collection;
let accountCollection: Collection;

describe('Survey Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL as string);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
      surveyCollection = await MongoHelper.getCollection("surveys");
      await surveyCollection.deleteMany({})

      accountCollection = await MongoHelper.getCollection("accounts");
      await accountCollection.deleteMany({})
  })

  describe("surveys / POST", () => {
    test('Should return 403 on add survey without access token', async () => {
      await request(app)
        .post("/api/survey")
        .send({
          question: "any_question",
          answers: [
              { image: "http://image/1", answer: "answer_1"},
              { image: "http://image/2", answer: "answer_2"}
          ],
        })
        .expect(403);
    });

    test('Should return 204 on add survey success', async () => {
      const res = await accountCollection.insertOne({
        name: "Oscar Raniz",
        email: "bronceRaniz@gmail.com",
        password: "123",
        role: "admin",
      });
      const id = res.insertedId.toString();
      const accessToken = sign({id}, env.jwtSecret);
      await accountCollection.updateOne({
        _id: res.insertedId,
      },{
        $set: {
            accessToken,
            id,
        }
      });
      await request(app)
        .post("/api/survey")
        .set('x-access-token', accessToken)
        .send({
          question: "any_question",
          answers: [
              { image: "http://image/1", answer: "answer_1"},
              { image: "http://image/2", answer: "answer_2"}
          ],
        })
        .expect(204);
    });
  });

});
