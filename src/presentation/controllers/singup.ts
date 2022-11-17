import { MissingParamError } from "../errors/MissinParamError";
import { HttpRequest, HttpResponse } from "../protocols/http";
import { badRequest, internalError } from "../helpers/badRequest";
import { Controller } from "../protocols/controller";
import { EmailValidator } from "../protocols/emailValidator";
import { InvalidParamError } from "../errors/InvalidParamError";
import { ServerError } from "../errors/ServerError";

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
            return internalError(new ServerError());
        }
    }
}
