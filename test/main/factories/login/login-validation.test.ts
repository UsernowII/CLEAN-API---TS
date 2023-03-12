import { ValidationComposite, RequiredFieldsValidation, EmailValidation } from '../../../../src/validation/validators';
import { Validation } from "../../../../src/presentation/protocols";
import { EmailValidator } from '../../../../src/validation/protocols/emailValidator';
import { makeLoginValidation } from "../../../../src/main/factories/controllers/login/login-validation-factory";

jest.mock("../../../../src/validation/validators/validationComposite");

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
