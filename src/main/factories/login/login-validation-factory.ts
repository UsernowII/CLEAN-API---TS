import { Validation } from "../../../presentation/controllers/signup/signup-protocols";
import { ValidationComposite, EmailValidation, RequiredFieldsValidation } from "../../../presentation/helpers/validators";
import { EmailValidatorAdapter } from "../../adapters/validators/emailValidatorAdapter";

export const makeLoginValidation = (): ValidationComposite => {
    const requiredFields = ["email", "password"];
    const validations: Validation[] = [];
    for (const field of requiredFields) {
        validations.push(new RequiredFieldsValidation(field));
    }
    validations.push(new EmailValidation(new EmailValidatorAdapter(), "email"));
    return new ValidationComposite(validations);
};
