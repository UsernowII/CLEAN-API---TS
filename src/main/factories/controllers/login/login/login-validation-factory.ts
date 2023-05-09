import { Validation } from "../../../../../presentation/protocols";
import { ValidationComposite, EmailValidation, RequiredFieldsValidation } from "../../../../../validation/validators";
import { EmailValidatorAdapter } from "../../../../../infra/validators/emailValidatorAdapter";

export const makeLoginValidation = (): ValidationComposite => {
    const requiredFields = ["email", "password"];
    const validations: Validation[] = [];
    for (const field of requiredFields) {
        validations.push(new RequiredFieldsValidation(field));
    }
    validations.push(new EmailValidation(new EmailValidatorAdapter(), "email"));
    return new ValidationComposite(validations);
};
