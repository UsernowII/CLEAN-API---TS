import { MissingParamError, InvalidParamError } from "../errors";
import { badRequest, serverError } from "../helpers/badRequest";
import { Controller, EmailValidator, HttpRequest, HttpResponse } from "../protocols";

export class SignUpController implements Controller {
    private readonly emailValidator: EmailValidator;

    constructor (emailValidator: EmailValidator) {
        this.emailValidator = emailValidator;
    }

    handle (httpRequest: HttpRequest): HttpResponse {
        try {
            const requiredFields = ["name", "email", "password", "passwordConfirmation"];
            for (const field of requiredFields) {
                if (!httpRequest.body[field]) {
                    return badRequest(new MissingParamError(field));
                }
            }
            const { email } = httpRequest.body;
            const isValid = this.emailValidator.isValid(email);
            if (!isValid) return badRequest(new InvalidParamError(email));
            return { statusCode: 200, body: {} };
        } catch (error) {
            return serverError();
        }
    }
}
