import { Validation } from "../../../../src/presentation/protocols";
import { makeSignUpValidation} from "../../../../src/main/factories/controllers/login/signup/signup-validation-factory";
import { EmailValidator } from '../../../../src/validation/protocols/emailValidator';
import { 
  RequiredFieldsValidation,
  CompareFieldsValidation,
  EmailValidation,
  ValidationComposite 
} from "../../../../src/validation/validators";

jest.mock("../../../../src/validation/validators/validationComposite");


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
