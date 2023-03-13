import { badRequest, serverError } from "../../helpers/http/http-helper";
import { AddSurvey, Controller, HttpRequest, HttpResponse, Validation } from "./add-survey-protocols";

export class AddSurveyController implements Controller {
    constructor (
        private readonly validation: Validation,
        private readonly addSurvey: AddSurvey
    ) {}

    async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
        const error = this.validation.validate(httpRequest.body);
        if (error) return badRequest(error);
        try {
            await this.addSurvey.add(httpRequest.body);
            return null;
        } catch (error) {
            return serverError(error);
        }
    };
}
