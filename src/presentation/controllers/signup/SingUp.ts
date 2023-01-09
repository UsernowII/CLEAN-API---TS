import { Controller, HttpRequest, HttpResponse, AddAccount, Validation } from "./signup-protocols";
import { badRequest, serverError, createdOk } from "../../helpers/http-helper";

export class SignUpController implements Controller {
    private readonly addAccount: AddAccount;
    private readonly validation: Validation;

    constructor (addAccount: AddAccount, validation: Validation) {
        this.addAccount = addAccount;
        this.validation = validation;
    }

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
            return createdOk(account);
        } catch (error) {
            return serverError(error);
        }
    }
}
