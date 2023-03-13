import { HttpRequest, HttpResponse, Middleware } from "../protocols";
import { forbidden } from "../helpers/http/http-helper";
import { AccessDeniedError } from "../errors";
import { LoadAccountByToken } from "../../domain/usecases/loadAccountByToken";

export class AuthMiddleware implements Middleware {
    constructor (private readonly loadAccountBytoken: LoadAccountByToken) {}

    async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
        const accessToken = httpRequest.headers?.["x-access-token"];
        if (accessToken) {
            await this.loadAccountBytoken.load(accessToken);
        }
        return forbidden(new AccessDeniedError());
    }
}
