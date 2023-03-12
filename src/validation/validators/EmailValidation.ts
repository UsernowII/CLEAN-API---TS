import { InvalidParamError } from "../../presentation/errors";
import { Validation } from "../../presentation/protocols/validation";
import { EmailValidator } from "../protocols/emailValidator";

export class EmailValidation implements Validation {
    constructor (
        private readonly emailValidator: EmailValidator,
        private readonly fieldName: string
    ) {}

    validate (data: any): Error {
        const isValid = this.emailValidator.isValid(data[this.fieldName]);
        if (!isValid) return new InvalidParamError(this.fieldName);
        return null;
    }
}
