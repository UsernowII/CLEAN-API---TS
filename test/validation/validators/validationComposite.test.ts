import { ValidationComposite } from "../../../src/validation/validators";
import { MissingParamError, InvalidParamError } from '../../../src/presentation/errors';
import { Validation } from '../../../src/presentation/protocols/validation';

type SutTypes = {
	sut: ValidationComposite,
	validationStubs: Validation[]
}

const makeValidation = (): Validation => {
	class ValidationStub implements Validation {
		validate = (data: any): Error => null!;
	}
	return new ValidationStub();
}

const makeSut = (): SutTypes => {
	const validationStubs = [
		makeValidation(),
		makeValidation()
	];
	const sut =  new ValidationComposite(validationStubs)
	return {
		sut,
		validationStubs
  }
}

describe('Validation Composite', () => {
  test('Should return an error if any validation fails', () => {
    const { sut, validationStubs} = makeSut();
		jest.spyOn(validationStubs[1], "validate").mockReturnValueOnce( new MissingParamError("field"))
    const error = sut.validate({ field: "any_value"});
    expect(error).toEqual(new MissingParamError("field"));
  });

	test('Should return the first error found if validation fails', () => {
    const { sut, validationStubs} = makeSut();
		jest.spyOn(validationStubs[0], "validate").mockReturnValueOnce( new InvalidParamError("field"))
		jest.spyOn(validationStubs[1], "validate").mockReturnValueOnce( new MissingParamError("field"))
    const error = sut.validate({ field: "any_value"});
    expect(error).toEqual(new InvalidParamError("field"));
  });

	test('Should return null if validation success', () => {
    const { sut } = makeSut();
    const error = sut.validate({ field: "any_value"});
    expect(error).toBeNull();
  });
});
