import { Controller, HttpRequest, HttpResponse } from "../../protocols";
import { badRequest } from "../../helpers/http-helper";
import { MissingParamError } from "../../errors";
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
        this.emailValidator.isValid(email);
        return null;
    };
}
