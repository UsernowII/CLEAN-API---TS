import { makeSignUpValidation } from '../../../src/main/factories/signup-validation';
import { ValidationComposite } from '../../../src/presentation/helpers/validators/ValidationComposite';
import { RequiredFieldsValidation } from '../../../src/presentation/helpers/validators/RequiredFieldsValidation';
import { EmailValidator, Validation } from '../../../src/presentation/controllers/signup/signup-protocols';
import { CompareFieldsValidation } from '../../../src/presentation/helpers/validators/CompareFieldsValidation';
import { EmailValidation } from '../../../src/presentation/helpers/validators/EmailValidation';

jest.mock("../../../src/presentation/helpers/validators/ValidationComposite");

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      return true;
    };
  }
  return new EmailValidatorStub();
};

describe('SignUpValidation', () => {
  test('Should call ValidationComposite with all validations', () => {
    makeSignUpValidation();
    const requiredFields = ["name", "email", "password", "passwordConfirmation"];
    const validations: Validation[] = [];
    for (const field of requiredFields) {
      validations.push(new RequiredFieldsValidation(field));
    }
    validations.push(new CompareFieldsValidation("password", "passwordConfirmation"));
    validations.push(new EmailValidation(makeEmailValidator(), "email"));
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  });
});
