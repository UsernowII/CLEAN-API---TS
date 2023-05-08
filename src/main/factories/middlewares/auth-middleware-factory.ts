import { AuthMiddleware } from "../../../presentation/middlewares/auth-middleware";
import { Middleware } from "../../../presentation/protocols";
import { makeDbLoadAccountToken } from "../usecases/account/load-account-token/load-account-token-factory";

export const makeAuthMiddleware = (role?: string): Middleware => {
    return new AuthMiddleware(makeDbLoadAccountToken(), role);
};
