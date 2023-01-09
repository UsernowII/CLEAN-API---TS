import { Validation } from "../../presentation/controllers/signup/signup-protocols";
import { CompareFieldsValidation } from "../../presentation/helpers/validators/CompareFieldsValidation";
import { EmailValidation } from "../../presentation/helpers/validators/EmailValidation";
import { RequiredFieldsValidation } from "../../presentation/helpers/validators/RequiredFieldsValidation";
import { ValidationComposite } from "../../presentation/helpers/validators/ValidationComposite";
import { EmailValidatorAdapter } from "../../utils/emailValidatorAdapter";

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
