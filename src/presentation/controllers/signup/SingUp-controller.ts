import { Controller, HttpRequest, HttpResponse, AddAccount, Validation, Authentication } from "./signup-protocols";
import { badRequest, serverError, createdOk } from "../../helpers/http/http-helper";

export class SignUpController implements Controller {
    constructor (
        private readonly addAccount: AddAccount,
        private readonly validation: Validation,
        private readonly authentication: Authentication
    ) {}

    async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
        try {
            const error = this.validation.validate(httpRequest.body);
            if (error) {
                return badRequest(error);
            }

            const { name, email, password } = httpRequest.body;
            const account = await this.addAccount.add({
                name,
                email,
                password
            });
            await this.authentication.auth({ email, password });
            return createdOk(account);
        } catch (error) {
            return serverError(error);
        }
    }
}
