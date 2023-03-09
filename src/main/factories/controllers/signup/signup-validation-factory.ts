import { Validation } from "../../../../presentation/controllers/signup/signup-protocols";
import { CompareFieldsValidation, EmailValidation, RequiredFieldsValidation, ValidationComposite } from "../../../../presentation/helpers/validators";
import { EmailValidatorAdapter } from "../../../adapters/validators/emailValidatorAdapter";

export const makeSignUpValidation = (): ValidationComposite => {
    const requiredFields = ["name", "email", "password", "passwordConfirmation"];
    const validations: Validation[] = [];
    for (const field of requiredFields) {
        validations.push(new RequiredFieldsValidation(field));
    }
    validations.push(new CompareFieldsValidation("password", "passwordConfirmation"));
    validations.push(new EmailValidation(new EmailValidatorAdapter(), "email"));
    return new ValidationComposite(validations);
};
