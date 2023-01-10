import { ValidationComposite } from '../../../src/presentation/helpers/validators/ValidationComposite';
import { MissingParamError } from '../../../src/presentation/errors/MissinParamError';
import { Validation } from '../../../src/presentation/helpers/validators/validation';

type SutTypes = {
	sut: ValidationComposite,
	validationStub: Validation
}

const makeValidation = (): Validation => {
	class ValidationStub implements Validation {
		validate = (data: any): Error => null; 
	}
	return new ValidationStub();
}

const makeSut = (): SutTypes => {
	const validationStub = makeValidation();
	const sut =  new ValidationComposite([validationStub])
	return {
		sut,
		validationStub
  }
}

describe('Validation Composite', () => {
  test('Should return an error if any validation fails', () => {   
    const { sut, validationStub } = makeSut();
		jest.spyOn(validationStub, "validate").mockReturnValueOnce( new MissingParamError("field"))
    const error = sut.validate({ field: "any_value"});
    expect(error).toEqual(new MissingParamError("field"));
  });

	test('Should return null if validation success', () => {   
    const { sut } = makeSut();
    const error = sut.validate({ field: "any_value"});
    expect(error).toBeNull();
  });
});
