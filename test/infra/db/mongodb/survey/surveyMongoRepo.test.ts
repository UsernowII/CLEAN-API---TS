import { Collection } from "mongodb";
import { MongoHelper } from "../../../../../src/infra/db/mongodb/helpers/mongo-helper";
import { AddSurveyRepository } from "../../../../../src/data/protocols/db/survey/addSurveyRepository";
import { SurveyMongoRepository } from '../../../../../src/infra/db/mongodb/survey/surveyMongoRepository';

let surveyCollection: Collection;

describe('Survey Mongo Repository', () => {

  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL as string);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection("surveys");
    await surveyCollection.deleteMany({});
  })

  const makeSut = (): AddSurveyRepository => {
    return new SurveyMongoRepository();
  }

  test('Should cal AddSurvey on success', async () => {
    const sut = makeSut();
    await sut.add({
      question: "any_question",
      answers: [{ image: "any_image1", answer: "any_answer"}, { answer: "another_answer"}],
    });
    const survey = await surveyCollection.findOne({ question: "any_question"})
    expect(survey).toBeTruthy();
  });

});
