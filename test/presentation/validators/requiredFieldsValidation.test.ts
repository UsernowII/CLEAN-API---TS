import { MissingParamError } from "../../../src/presentation/errors";
import { RequiredFieldsValidation } from "../../../src/presentation/helpers/validators/RequiredFieldsValidation";


const makeSut = (field: string): RequiredFieldsValidation => {
  return new RequiredFieldsValidation(field); 
}

describe('Required Fields Validation', () => {
  test('Should return a MissigParamError if validation fails', () => {
    const sut = makeSut("field");
    const error = sut.validate({ name: "any_name"});
    expect(error).toEqual(new MissingParamError("field"));
  });

  test('Should not return if validation success', () => {
    const sut = makeSut("field");
    const error = sut.validate({ field: "any_name"});
    expect(error).toBeNull();
  });
  
});
