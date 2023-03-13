import { SurveyMongoRepository } from "../../../../infra/db/mongodb/survey/surveyMongoRepository";
import { AddSurvey } from "../../../../domain/usecases/addSurvey";
import { DbAddSurvey } from "../../../../data/usecases/add-survey/db-add-survey";

export const makeDbAddSurvey = (): AddSurvey => {
    const surveyMongoRepo = new SurveyMongoRepository();
    return new DbAddSurvey(surveyMongoRepo);
};
