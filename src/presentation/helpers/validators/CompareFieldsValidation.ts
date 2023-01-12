import { Validation } from "../../protocols/validation";
import { InvalidParamError } from "../../errors";

export class CompareFieldsValidation implements Validation {
    private readonly fieldName: string;
    private readonly compareFieldName: string;

    constructor (fieldName: string, compareFieldName: string) {
        this.fieldName = fieldName;
        this.compareFieldName = compareFieldName;
    }

    validate (data: any): Error {
        if (data[this.fieldName] !== data[this.compareFieldName]) {
            return new InvalidParamError(this.fieldName);
        };
        return null;
    }
}
