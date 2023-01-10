import { InvalidParamError } from "../../../src/presentation/errors";
import { CompareFieldsValidation } from "../../../src/presentation/helpers/validators/CompareFieldsValidation";

const makeSut = (): CompareFieldsValidation => {
  return new CompareFieldsValidation("field", "compareField"); 
}

describe('Compare Fields Validation', () => {
  test('Should return a InvalidParamError if validation fails', () => {
    const sut = makeSut();
    const error = sut.validate({ field: "any_value", compareField: "wrong_value"});
    expect(error).toEqual(new InvalidParamError("field"));
  });

  test('Should not return if validation success', () => {
    const sut = makeSut();
    const error = sut.validate({ field: "any_value", compareField: "any_value"});
    expect(error).toBeNull();
  });
  
});
