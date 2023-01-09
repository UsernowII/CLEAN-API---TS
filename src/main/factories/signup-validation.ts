import { Validation } from "../../presentation/controllers/signup/signup-protocols";
import { RequiredFieldValidation } from "../../presentation/helpers/validators/RequiredFieldValidation";
import { ValidationComposite } from "../../presentation/helpers/validators/ValidationComposite";

export const makeSignUpValidation = (): ValidationComposite => {
    const requiredFields = ["name", "email", "password", "passwordConfirmation"];
    const validations: Validation[] = [];
    for (const field of requiredFields) {
        validations.push(new RequiredFieldValidation(field));
    }
    return new ValidationComposite(validations);
};
