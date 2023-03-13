import { DbAddSurvey } from "../../../../src/data/usecases/add-survey/db-add-survey"
import { AddSurveyModel } from '../../../../src/domain/usecases/addSurvey';
import { AddSurveyRepository } from "../../protocols/db/survey/addSurveyRepository";

const makeFakeSurveyData = (): AddSurveyModel => ({
  question: "any_question",
  answers: [{ image: "any_image", answer: "any_answer" }]
})

describe('DbAddsurvey Usecase', () => {
  test('Should call AddSurveyRepository wwith correct values', async () => {
      class AddSurveyRepositoryStub implements AddSurveyRepository {
        async add (_surveyData: AddSurveyModel): Promise<void> {
          return Promise.resolve();
        }
        
      }
      const addSurveyRepository = new AddSurveyRepositoryStub();
      const addSpy = jest.spyOn(addSurveyRepository, "add");
      const sut = new DbAddSurvey(addSurveyRepository);
      await sut.add(makeFakeSurveyData());
      expect(addSpy).toHaveBeenCalledWith(makeFakeSurveyData())
  });
});
