import { Controller, HttpRequest, HttpResponse } from "../../protocols";
import { badRequest } from "../../helpers/http-helper";
import { MissingParamError, InvalidParamError } from "../../errors";
import { EmailValidator } from "../../protocols/emailValidator";

export class LoginController implements Controller {
    private readonly emailValidator: EmailValidator;

    constructor (emailValidator: EmailValidator) {
        this.emailValidator = emailValidator;
    }

    async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
        if (!httpRequest.body.email) {
            return badRequest(new MissingParamError("email"));
        }
        if (!httpRequest.body.password) {
            return badRequest(new MissingParamError("password"));
        }
        const { email } = httpRequest.body;
        if (!this.emailValidator.isValid(email)) {
            return badRequest(new InvalidParamError(email));
        };
        return null;
    };
}
