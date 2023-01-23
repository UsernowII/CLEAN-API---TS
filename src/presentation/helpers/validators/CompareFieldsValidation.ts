import { Validation } from "../../protocols/validation";
import { InvalidParamError } from "../../errors";

export class CompareFieldsValidation implements Validation {
    constructor (
        private readonly fieldName: string,
        private readonly compareFieldName: string
    ) {}

    validate (data: any): Error {
        if (data[this.fieldName] !== data[this.compareFieldName]) {
            return new InvalidParamError(this.fieldName);
        };
        return null;
    }
}
