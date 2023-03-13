import { HttpRequest, HttpResponse, Middleware } from "../protocols";
import { forbidden, ok, serverError } from "../helpers/http/http-helper";
import { AccessDeniedError } from "../errors";
import { LoadAccountByToken } from "../../domain/usecases/loadAccountByToken";

export class AuthMiddleware implements Middleware {
    constructor (private readonly loadAccountBytoken: LoadAccountByToken) {}

    async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
        try {
            const accessToken = httpRequest.headers?.["x-access-token"];
            if (accessToken) {
                const account = await this.loadAccountBytoken.load(accessToken);
                if (account) return ok({ accountId: account.id });
            }
            return forbidden(new AccessDeniedError());
        } catch (error) {
            return serverError(error);
        }
    }
}
