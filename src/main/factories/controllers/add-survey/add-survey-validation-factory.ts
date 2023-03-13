import { Validation } from "../../../../presentation/protocols";
import { ValidationComposite, RequiredFieldsValidation } from "../../../../validation/validators";

export const makeAddSurveyValidation = (): ValidationComposite => {
    const requiredFields = ["question", "answers"];
    const validations: Validation[] = [];
    for (const field of requiredFields) {
        validations.push(new RequiredFieldsValidation(field));
    }
    return new ValidationComposite(validations);
};
