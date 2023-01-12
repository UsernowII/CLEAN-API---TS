import { MissingParamError } from "../../errors";
import { Validation } from "../../protocols/validation";

export class RequiredFieldsValidation implements Validation {
    private readonly fieldName: string;

    constructor (fieldName: string) {
        this.fieldName = fieldName;
    }

    validate (data: any): Error {
        if (!data[this.fieldName]) return new MissingParamError(this.fieldName);
        return null;
    }
}
