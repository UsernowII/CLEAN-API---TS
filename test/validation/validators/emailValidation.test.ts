import { EmailValidation } from "../../../src/validation/validators";
import { InvalidParamError } from "../../../src/presentation/errors";
import { EmailValidator } from "../../../src/validation/protocols/emailValidator";

type SutTypes = {
  sut: EmailValidation,
  emailValidatorStub: EmailValidator,
}

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      return true;
    };
  }
  return new EmailValidatorStub();
};

const makeEmailValidatorWithError = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      throw new InvalidParamError(email);
    };
  }
  return new EmailValidatorStub();
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator();
  const sut = new EmailValidation(emailValidatorStub, "email");
  return {
    sut,
    emailValidatorStub,
  }
}

describe('Email Validation', () => {
  test('Should return an error if EmailValidator return false', () => {
    const { sut, emailValidatorStub } = makeSut();
    jest.spyOn(emailValidatorStub, "isValid").mockReturnValueOnce(false);
    const error = sut.validate({email: "any_email@email.com"});
    expect(error).toEqual(new InvalidParamError("email"));
  });

  test('Should call Email Validator with correct email', () => {
    const { sut, emailValidatorStub } = makeSut();
    const isValidSpy = jest.spyOn(emailValidatorStub, "isValid");
    sut.validate({email: "any_email@email.com"});
    expect(isValidSpy).toHaveBeenCalledWith("any_email@email.com");
  });

  test('Should throw if EmailValidator throws', () => {
    const emailValidatorStub = makeEmailValidatorWithError();
    const sut = new EmailValidation(emailValidatorStub, "email");
    try {
      sut.validate({email: "any_email@email.com"});
    }catch (e) {
      expect(e).toBeInstanceOf(InvalidParamError);
    }
  });

  test('Should throw if EmailValidator throws with Jest', () => {
    const { sut, emailValidatorStub } = makeSut();
    jest.spyOn(emailValidatorStub, "isValid").mockImplementationOnce(() => {
      throw new Error();
    })
    expect(sut.validate).toThrowError();
  });

});
