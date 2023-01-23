import { MissingParamError } from "../../errors";
import { Validation } from "../../protocols/validation";

export class RequiredFieldsValidation implements Validation {
    constructor (private readonly fieldName: string) {}

    validate (data: any): Error {
        if (!data[this.fieldName]) return new MissingParamError(this.fieldName);
        return null;
    }
}
