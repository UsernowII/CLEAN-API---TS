import { AddSurveyModel, AddSurvey, AddSurveyRepository } from "./db-add-survey-protocols";

export class DbAddSurvey implements AddSurvey {
    constructor (
        private readonly addSurveyRepo: AddSurveyRepository
    ) {}

    async add (surveyData: AddSurveyModel): Promise<void> {
        await this.addSurveyRepo.add(surveyData);
        return null;
    }
}
