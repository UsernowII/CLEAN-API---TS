import { Collection } from "mongodb";
import request from "supertest";
import app from "../../../src/main/config/app";
import { MongoHelper } from "../../../src/infra/db/mongodb/helpers/mongo-helper";

let surveyCollection: Collection;

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

  })

  describe("surveys / POST", () => {
    test('Should return 204 on add survey success', async () => {
      await request(app)
        .post("/api/survey")
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
