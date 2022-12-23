import { LoginController } from "../../../src/presentation/controllers/login/login";
import { HttpRequest } from '../../../src/presentation/protocols/http';
import { badRequest } from "../../../src/presentation/helpers/http-helper";
import { MissingParamError } from '../../../src/presentation/errors/MissinParamError';

describe('Login Controller', () => {
  test('Should return 400 if no email is provided', async () => {
    const sut = new LoginController();
		const httpRequest: HttpRequest = {
			body: { 
				password: "any_password"
			}
		}
		const httpResponse = await sut.handle(httpRequest);
		expect(httpResponse).toEqual(badRequest(new MissingParamError("email")))
  });
});
