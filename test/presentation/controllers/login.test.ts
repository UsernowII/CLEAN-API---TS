import { LoginController } from "../../../src/presentation/controllers/login/login";
import { badRequest, serverError, unauthorized, ok } from '../../../src/presentation/helpers/http-helper';
import { MissingParamError, InvalidParamError } from "../../../src/presentation/errors";
import { EmailValidator, Authentication, HttpRequest } from "../../../src/presentation/controllers/login/login-protocols";

interface SutTypes {
	sut: LoginController,
	emailValidatorStub: EmailValidator,
	authenticationStub: Authentication
}

const makeFakehttpRequest = (): HttpRequest => ({
	body: { 
		email: "any_email@email.com",
		password: "any_password",
	}
});

const makeEmailValidator = (): EmailValidator => {
	class EmailValidatorStub implements EmailValidator {
		isValid (email: string): boolean {
			return true;
		}	
	}
	return new EmailValidatorStub();
};

const makeAuthentication = (): Authentication => {
	class AuthenticationStub implements Authentication {
		async auth (email: string, password: string): Promise<string> {
			return Promise.resolve("any_token");
		}	
	}
	return new AuthenticationStub();
};

const makesut = (): SutTypes => {
	const emailValidatorStub = makeEmailValidator();
	const authenticationStub = makeAuthentication();
	const sut = new LoginController(emailValidatorStub, authenticationStub);
	return {
		sut,
		emailValidatorStub,
		authenticationStub
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

	test('Should return 400 if invalid email is provided', async () => {
    const { sut, emailValidatorStub } = makesut();
		jest.spyOn(emailValidatorStub, "isValid").mockReturnValueOnce(false);
		const httpResponse = await sut.handle(makeFakehttpRequest());
		expect(httpResponse).toEqual(badRequest(new InvalidParamError("any_email@email.com")))
  });

	test('Should call EmailValidator with correct values', async () => {
    const { sut, emailValidatorStub } = makesut();
		const isValidSpy = jest.spyOn(emailValidatorStub, "isValid");
		await sut.handle(makeFakehttpRequest());
		expect(isValidSpy).toHaveBeenCalledWith("any_email@email.com");
		expect(isValidSpy).toHaveBeenCalledTimes(1);
  });
	
	test('Should return 500 if email validator throws', async () => {
    const { sut, emailValidatorStub } = makesut();
		jest.spyOn(emailValidatorStub, "isValid").mockImplementationOnce(() => {
			throw new Error();
		});
		const httpResponse = await sut.handle(makeFakehttpRequest());
		expect(httpResponse).toEqual(serverError(new Error()))
  });

	test('Should call Authentication with correct values', async () => {
    const { sut, authenticationStub } = makesut();
		const authSpy = jest.spyOn(authenticationStub, "auth");
		await sut.handle(makeFakehttpRequest());
		expect(authSpy).toHaveBeenCalledWith("any_email@email.com", "any_password");
		expect(authSpy).toHaveBeenCalledTimes(1);
  });

	test('Should return 401 if invalid credentials are provided', async () => {
    const { sut, authenticationStub } = makesut();
		jest.spyOn(authenticationStub, "auth").mockReturnValueOnce(Promise.resolve(null));
		const httpResponse = await sut.handle(makeFakehttpRequest());
		expect(httpResponse).toEqual(unauthorized());
  });

	test('Should return 500 if authentication throws', async () => {
    const { sut, authenticationStub } = makesut();
		jest.spyOn(authenticationStub, "auth").mockReturnValueOnce( Promise.reject(new Error()));
		const httpResponse = await sut.handle(makeFakehttpRequest());
		expect(httpResponse).toEqual(serverError(new Error()))
  });

	test('Should return 200 if valid credentials are provided', async () => {
    const { sut } = makesut();
		const httpResponse = await sut.handle(makeFakehttpRequest());
		expect(httpResponse).toEqual(ok({accessToken : "any_token"}));
  });
});
