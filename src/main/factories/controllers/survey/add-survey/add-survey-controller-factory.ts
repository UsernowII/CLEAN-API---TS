import { Controller } from "../../../../../presentation/protocols";
import { makeLogControllerDecorator } from "../../../decorators/log-decorator-factory";
import { AddSurveyController } from "../../../../../presentation/controllers/survey/add-survey-controller";
import { makeAddSurveyValidation } from "./add-survey-validation-factory";
import { makeDbAddSurvey } from "../../../usecases/survey/addSurvey/db-addSurvey-factory";

export const makeAddSurveyController = (): Controller => {
    const addSurrveyControllerr = new AddSurveyController(
        makeAddSurveyValidation(), makeDbAddSurvey()
    );
    return makeLogControllerDecorator(addSurrveyControllerr);
};
