import { ValidationComposite, RequiredFieldsValidation } from '../../../../src/validation/validators';
import { Validation } from "../../../../src/presentation/protocols";
import { makeAddSurveyValidation } from "../../../../src/main/factories/controllers/add-survey/add-survey-validation-factory"

jest.mock("../../../../src/validation/validators/validationComposite");

describe('Add Survey Validation', () => {
  test('Should call ValidationComposite with all validations', () => {
    makeAddSurveyValidation();
    const requiredFields = ["question", "answers"];
    const validations: Validation[] = [];
    for (const field of requiredFields) {
      validations.push(new RequiredFieldsValidation(field));
    }
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  });
});
