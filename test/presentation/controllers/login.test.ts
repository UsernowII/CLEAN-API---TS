import { LoginController } from "../../../src/presentation/controllers/login/login";
import { HttpRequest } from '../../../src/presentation/protocols/http';
import { badRequest } from "../../../src/presentation/helpers/http-helper";
import { MissingParamError } from '../../../src/presentation/errors/MissinParamError';

interface SutTypes {
	sut: LoginController,
}

const makesut = (): SutTypes => {
	const sut = new LoginController();
	return {
		sut,
	}
};

describe('Login Controller', () => {
  test('Should return 400 if no email is provided', async () => {
    const { sut } = makesut();
		const httpRequest: HttpRequest = {
			body: { 
				password: "any_password"
			}
		}
		const httpResponse = await sut.handle(httpRequest);
		expect(httpResponse).toEqual(badRequest(new MissingParamError("email")))
  });
  test('Should return 400 if no password is provided', async () => {
    const { sut } = makesut();
		const httpRequest: HttpRequest = {
			body: { 
				email: "any_email@email.com"
			}
		}
		const httpResponse = await sut.handle(httpRequest);
		expect(httpResponse).toEqual(badRequest(new MissingParamError("password")))
  });
	test('Should return 400 if no password is provided', async () => {
    const { sut } = makesut();
		const httpRequest: HttpRequest = {
			body: { 
				email: "any_email@email.com"
			}
		}
		const httpResponse = await sut.handle(httpRequest);
		expect(httpResponse).toEqual(badRequest(new MissingParamError("password")))
  });
});
