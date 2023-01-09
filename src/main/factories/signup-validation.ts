import { Validation } from "../../presentation/controllers/signup/signup-protocols";
import { CompareFieldsValidation } from "../../presentation/helpers/validators/CompareFieldsValidation";
import { RequiredFieldsValidation } from "../../presentation/helpers/validators/RequiredFieldsValidation";
import { ValidationComposite } from "../../presentation/helpers/validators/ValidationComposite";

export const makeSignUpValidation = (): ValidationComposite => {
    const requiredFields = ["name", "email", "password", "passwordConfirmation"];
    const validations: Validation[] = [];
    for (const field of requiredFields) {
        validations.push(new RequiredFieldsValidation(field));
    }
    validations.push(new CompareFieldsValidation("password", "passwordConfirmation"));
    return new ValidationComposite(validations);
};
