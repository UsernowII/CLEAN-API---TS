import { makeSignUpValidation } from '../../../src/main/factories/signup-validation';
import { ValidationComposite } from '../../../src/presentation/helpers/validators/ValidationComposite';
import { RequiredFieldsValidation } from '../../../src/presentation/helpers/validators/RequiredFieldsValidation';
import { Validation } from '../../../src/presentation/controllers/signup/signup-protocols';
import { CompareFieldsValidation } from '../../../src/presentation/helpers/validators/CompareFieldsValidation';

jest.mock("../../../src/presentation/helpers/validators/ValidationComposite");

describe('SignUpValidation', () => {
  test('Should call ValidationComposite with all validations', () => {
    makeSignUpValidation();
    const requiredFields = ["name", "email", "password", "passwordConfirmation"];
    const validations: Validation[] = [];
    for (const field of requiredFields) {
      validations.push(new RequiredFieldsValidation(field));
    }
    validations.push(new CompareFieldsValidation("password", "passwordConfirmation"));
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  });
});
