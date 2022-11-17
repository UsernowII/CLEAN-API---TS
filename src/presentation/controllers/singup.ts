import { MissingParamError } from "../errors/MissinParamError";
import { HttpRequest, HttpResponse } from "../protocols/http";
import { badRequest } from "../helpers/badRequest";

export class SignUpController {
    handle (httpRequest: HttpRequest): HttpResponse {
        const requiredFields = ["name", "email", "password", "passwordConfirmation"];
        for (const field of requiredFields) {
            if (!httpRequest.body[field]) {
                return badRequest(new MissingParamError(field));
            }
        }
        return badRequest(new MissingParamError("any"));
    }
}
