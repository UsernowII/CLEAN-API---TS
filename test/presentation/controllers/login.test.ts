import { LoginController } from "../../../src/presentation/controllers/login/login";
import { HttpRequest } from '../../../src/presentation/protocols/http';
import { badRequest, serverError } from '../../../src/presentation/helpers/http-helper';
import { MissingParamError } from '../../../src/presentation/errors/MissinParamError';
import { EmailValidator } from '../../../src/presentation/protocols/emailValidator';
import { EmailValidatorAdapter } from '../../../src/utils/emailValidatorAdapter';
import { InvalidParamError } from '../../../src/presentation/errors/InvalidParamError';

interface SutTypes {
	sut: LoginController,
	emailValidatorStub: EmailValidator,
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
	return new EmailValidatorAdapter();
};

const makesut = (): SutTypes => {
	const emailValidatorStub = makeEmailValidator();
	const sut = new LoginController(emailValidatorStub);
	return {
		sut,
		emailValidatorStub,
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
});
