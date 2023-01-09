import { makeSignUpValidation } from '../../../src/main/factories/signup-validation';
import { ValidationComposite } from '../../../src/presentation/helpers/validators/ValidationComposite';
import { RequiredFieldValidation } from '../../../src/presentation/helpers/validators/RequiredFieldValidation';
import { Validation } from '../../../src/presentation/controllers/signup/signup-protocols';

jest.mock("../../../src/presentation/helpers/validators/ValidationComposite");

describe('SignUpValidation', () => {
  test('Should call ValidationComposite with all validations', () => {
    makeSignUpValidation();
    const requiredFields = ["name", "email", "password", "passwordConfirmation"];
    const validations: Validation[] = [];
    for (const field of requiredFields) {
      validations.push(new RequiredFieldValidation(field));
    }
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  });
});
