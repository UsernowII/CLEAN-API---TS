import { Validation } from "../../../presentation/controllers/signup/signup-protocols";
import { EmailValidation } from "../../../presentation/helpers/validators/EmailValidation";
import { RequiredFieldsValidation } from "../../../presentation/helpers/validators/RequiredFieldsValidation";
import { ValidationComposite } from "../../../presentation/helpers/validators/ValidationComposite";
import { EmailValidatorAdapter } from "../../../utils/emailValidatorAdapter";

export const makeLoginValidation = (): ValidationComposite => {
    const requiredFields = ["email", "password"];
    const validations: Validation[] = [];
    for (const field of requiredFields) {
        validations.push(new RequiredFieldsValidation(field));
    }
    validations.push(new EmailValidation(new EmailValidatorAdapter(), "email"));
    return new ValidationComposite(validations);
};
