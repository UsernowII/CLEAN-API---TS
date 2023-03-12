import { Validation } from "../../../../presentation/protocols";
import { EmailValidatorAdapter } from "../../../../infra/validators/emailValidatorAdapter";
import { CompareFieldsValidation, EmailValidation, RequiredFieldsValidation, ValidationComposite } from "../../../../validation/validators";

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
