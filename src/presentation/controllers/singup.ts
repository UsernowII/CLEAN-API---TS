import { MissingParamError } from "../errors/MissinParamError";
import { HttpRequest, HttpResponse } from "../protocols/http";
import { badRequest } from "../helpers/badRequest";

export class SignUpController {
    handle (httpRequest: HttpRequest): HttpResponse {
        if (!httpRequest.body.name) {
            return badRequest(new MissingParamError("name"));
        }
        if (!httpRequest.body.email) {
            return badRequest(new MissingParamError("email"));
        }
        return badRequest(new MissingParamError("any"));
    }
}
