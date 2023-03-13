import { HttpRequest } from '../../../src/presentation/protocols/http';
import { AuthMiddleware } from "../../../src/presentation/middlewares/auth-middleware";
import { forbidden } from '../../../src/presentation/helpers/http/http-helper';
import { AccessDeniedError } from '../../../src/presentation/errors';

describe('Auth Middleware', () => {
  test('Should return 403 if no x-access-token exist', async () => {
    const sut = new AuthMiddleware();
    const httpRequest: HttpRequest = {headers: {}}
    const httpResponse = await sut.handle(httpRequest.headers);
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  });
});
