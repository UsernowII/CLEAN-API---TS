import { ValidationComposite, RequiredFieldsValidation, EmailValidation } from '../../../../src/presentation/helpers/validators';
import { Validation } from '../../../../src/presentation/controllers/signup/signup-protocols';
import { EmailValidator } from '../../../../src/presentation/protocols/emailValidator';
import { makeLoginValidation } from '../../../../src/main/factories/login/login-validation-factory';

jest.mock("../../../../src/presentation/helpers/validators/ValidationComposite");

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      return true;
    };
  }
  return new EmailValidatorStub();
};

describe('Login Validation', () => {
  test('Should call ValidationComposite with all validations', () => {
    makeLoginValidation();
    const requiredFields = ["email", "password"];
    const validations: Validation[] = [];
    for (const field of requiredFields) {
      validations.push(new RequiredFieldsValidation(field));
    }
    validations.push(new EmailValidation(makeEmailValidator(), "email"));
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  });
});
