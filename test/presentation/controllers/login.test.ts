import { LoginController } from "../../../src/presentation/controllers/login/Login-controller";
import { MissingParamError } from "../../../src/presentation/errors";
import { badRequest, serverError, unauthorized, ok } from '../../../src/presentation/helpers/http/http-helper';
import { Validation, Authentication, HttpRequest, AuthenticationModel } from "../../../src/presentation/controllers/login/login-protocols";

interface SutTypes {
	sut: LoginController,
	authenticationStub: Authentication,
	validationStub: Validation,
}

const makeFakeHttpRequest = (): HttpRequest => ({
	body: {
		email: "any_email@email.com",
		password: "any_password",
	}
});

const makeValidation = (): Validation => {
	class ValidationStub implements Validation {
		validate(data: any): Error {
			return null;
		}
	};
	return new ValidationStub();
}

const makeAuthentication = (): Authentication => {
	class AuthenticationStub implements Authentication {
		async auth(auth: AuthenticationModel): Promise<string> {
			return Promise.resolve("any_token");
		}
	}
	return new AuthenticationStub();
};

const makeSut = (): SutTypes => {
	const authenticationStub = makeAuthentication();
	const validationStub = makeValidation();
	const sut = new LoginController(authenticationStub, validationStub);
	return {
		sut,
		authenticationStub,
		validationStub
	}
};

describe('Login Controller', () => {
	test('Should call Authentication with correct values', async () => {
		const { sut, authenticationStub } = makeSut();
		const authSpy = jest.spyOn(authenticationStub, "auth");
		await sut.handle(makeFakeHttpRequest());
		expect(authSpy).toHaveBeenCalledWith({
			email: "any_email@email.com",
			password: "any_password"
		});
		expect(authSpy).toHaveBeenCalledTimes(1);
	});

	test('Should return 401 if invalid credentials are provided', async () => {
		const { sut, authenticationStub } = makeSut();
		jest.spyOn(authenticationStub, "auth").mockReturnValueOnce(Promise.resolve(null));
		const httpResponse = await sut.handle(makeFakeHttpRequest());
		expect(httpResponse).toEqual(unauthorized());
	});

	test('Should return 500 if authentication throws', async () => {
		const { sut, authenticationStub } = makeSut();
		jest.spyOn(authenticationStub, "auth").mockReturnValueOnce(Promise.reject(new Error()));
		const httpResponse = await sut.handle(makeFakeHttpRequest());
		expect(httpResponse).toEqual(serverError(new Error()))
	});

	test('Should return 200 if valid credentials are provided', async () => {
		const { sut } = makeSut();
		const httpResponse = await sut.handle(makeFakeHttpRequest());
		expect(httpResponse).toEqual(ok({ accessToken: "any_token" }));
	});

	test('Should call Validation with correct values', () => {
		const { sut, validationStub } = makeSut();
		const validateSpy = jest.spyOn(validationStub, "validate");
		const httpRequest = makeFakeHttpRequest();
		sut.handle(httpRequest);
		expect(validateSpy).toHaveBeenCalledWith(httpRequest.body);
	});

	test('Should return 400 if Validation returns an error', async () => {
		const { sut, validationStub } = makeSut();
		jest.spyOn(validationStub, "validate").mockReturnValueOnce(new MissingParamError("any_field"));
		const httpResponse = await sut.handle(makeFakeHttpRequest());
		expect(httpResponse).toEqual(badRequest(new MissingParamError("any_field")));
	});
});
