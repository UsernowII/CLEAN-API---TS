import { SignUpController } from "../../../../src/presentation/controllers/login/signup/SingUp-controller";
import { MissingParamError, ServerError, UniqueEmailError } from "../../../../src/presentation/errors";
import { createdOk, badRequest, serverError, forbidden } from "../../../../src/presentation/helpers/http/http-helper";
import {
  AddAccount,
  AddAccountModel,
  AccountModel,
  HttpRequest,
  Validation
} from "../../../../src/presentation/controllers/login/signup/signup-protocols";
import { Authentication, AuthenticationModel } from "../../../../src/domain/usecases/authentication";

type SutTypes = {
  sut: SignUpController,
  addAccountStub: AddAccount,
  validationStub: Validation,
  authenticationStub: Authentication,
}

const makeFakeAccount = (): AccountModel => ({
  id: "valid_id",
  name: "valid_name",
  email: "valid_email@email.com",
  password: "valid_password",
});

const makeFakeRequest = (): HttpRequest => ({
  body: {
    name: "any_name",
    email: "any_email@email.com",
    password: "any_password",
    passwordConfirmation: "any_password"
  }
});

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate(_data: any): Error {
      return null!;
    }
  }
  return new ValidationStub();
}

const makeAuthentication = (): Authentication => {
	class AuthenticationStub implements Authentication {
		async auth(_auth: AuthenticationModel): Promise<string> {
			return Promise.resolve("any_token");
		}
	}
	return new AuthenticationStub();
};

const makeAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    add(_account: AddAccountModel): Promise<AccountModel> {
      return Promise.resolve(makeFakeAccount());
    };
  }
  return new AddAccountStub();
}

const makeSut = (): SutTypes => {
  const authenticationStub = makeAuthentication();
  const addAccountStub = makeAddAccount();
  const validationStub = makeValidation();
  const sut = new SignUpController(addAccountStub, validationStub, authenticationStub);
  return {
    sut,
    addAccountStub,
    validationStub,
    authenticationStub,
  }
}

describe('SignUp Controller', () => {
  test('Should call AddAccount with correct values', () => {
    const { sut, addAccountStub } = makeSut();
    const addSpy = jest.spyOn(addAccountStub, "add");
    sut.handle(makeFakeRequest());
    expect(addSpy).toHaveBeenCalledWith({
      name: "any_name",
      email: "any_email@email.com",
      password: "any_password",
    });
  });

  test('Should return 500 if AddAccount throws', async () => {
    const { sut, addAccountStub } = makeSut();
    jest.spyOn(addAccountStub, "add").mockImplementationOnce(() => {
      return Promise.reject(new Error());
    })
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(serverError(new ServerError(null!)));
  });

  test('Should return 201 if valid data is provided', async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse.statusCode).toBe(201);
    expect(httpResponse).toEqual(createdOk({ accessToken : "any_token"}));
  });

  test('Should return 403 if AddAccount returns null', async () => {
    const { sut, addAccountStub } = makeSut();
    jest.spyOn(addAccountStub, "add").mockReturnValueOnce(Promise.resolve(null!))
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse.statusCode).toBe(403);
    expect(httpResponse).toEqual(forbidden(new UniqueEmailError()));
  });

  test('Should call Validation with correct values', () => {
    const { sut, validationStub } = makeSut();
    const validateSpy = jest.spyOn(validationStub, "validate");
    const httpRequest = makeFakeRequest();
    sut.handle(httpRequest);
    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body);
  });

  test('Should return 400 if Validation returns an error', async () => {
    const { sut, validationStub } = makeSut();
    jest.spyOn(validationStub, "validate").mockReturnValueOnce(new MissingParamError("any_field"));
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(badRequest(new MissingParamError("any_field")));
  });

  test('Should call Authentication with correct values', async () => {
		const { sut, authenticationStub } = makeSut();
		const authSpy = jest.spyOn(authenticationStub, "auth");
		await sut.handle(makeFakeRequest());
		expect(authSpy).toHaveBeenCalledWith({
			email: "any_email@email.com",
			password: "any_password"
		});
		expect(authSpy).toHaveBeenCalledTimes(1);
	});
  test('Should return 500 if authentication throws', async () => {
		const { sut, authenticationStub } = makeSut();
		jest.spyOn(authenticationStub, "auth").mockReturnValueOnce(Promise.reject(new Error()));
		const httpResponse = await sut.handle(makeFakeRequest());
		expect(httpResponse).toEqual(serverError(new Error()))
	});
});
