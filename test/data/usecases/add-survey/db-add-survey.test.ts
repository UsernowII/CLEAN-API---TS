import { DbAddSurvey } from "../../../../src/data/usecases/add-survey/db-add-survey"
import { AddSurveyModel } from '../../../../src/domain/usecases/addSurvey';
import { AddSurveyRepository } from "../../../../src/data/protocols/db/survey/addSurveyRepository";

interface SutTypes {
  sut: DbAddSurvey,
  addSurveyRepositoryStub: AddSurveyRepository,
}

const makeFakeSurveyData = (): AddSurveyModel => ({
  question: "any_question",
  answers: [{ image: "any_image", answer: "any_answer" }]
})

const makeAddSurveyRepo = (): AddSurveyRepository => {
  class AddSurveyRepositoryStub implements AddSurveyRepository {
    async add (_surveyData: AddSurveyModel): Promise<void> {
      return Promise.resolve();
    }
  }
  return new AddSurveyRepositoryStub()
};


const makeSut = (): SutTypes => {
  const addSurveyRepositoryStub = makeAddSurveyRepo();
  const sut = new DbAddSurvey(addSurveyRepositoryStub);
  return { sut, addSurveyRepositoryStub}
}

describe('DbAddsurvey Usecase', () => {
  test('Should call AddSurveyRepository wwith correct values', async () => {
      const { sut, addSurveyRepositoryStub} = makeSut();
      const addSpy = jest.spyOn(addSurveyRepositoryStub, "add");
      await sut.add(makeFakeSurveyData());
      expect(addSpy).toHaveBeenCalledWith(makeFakeSurveyData())
  });
  test('Should throw if AddSurveyRepository throws', async () => {
    const { sut, addSurveyRepositoryStub } = makeSut();
    jest.spyOn(addSurveyRepositoryStub, "add").mockRejectedValueOnce(new Error());
    const promise = sut.add(makeFakeSurveyData());
    await expect(promise).rejects.toThrow();
  });
});


