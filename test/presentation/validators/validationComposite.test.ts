import { ValidationComposite } from '../../../src/presentation/helpers/validators/ValidationComposite';
import { MissingParamError } from '../../../src/presentation/errors/MissinParamError';
import { Validation } from '../../../src/presentation/helpers/validators/validation';

describe('Validation Composite', () => {
  test('Should return an error if any validation fails', () => {
    class ValidationStub implements Validation {
        validate = (data: any): Error => new MissingParamError("field"); 
    }
    const sut = new ValidationComposite([new ValidationStub()]);
    const error = sut.validate({ field: "any_value"});
    expect(error).toEqual(new MissingParamError("field"));
  });
});
