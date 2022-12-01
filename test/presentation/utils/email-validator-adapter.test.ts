import validator from "validator";
import { EmailValidatorAdapter } from "../../../src/utils/emailValidatorAdapter";

jest.mock('validator', () => ({
  isEmail(): boolean { 
    return true;
  }
}))

describe('EmailValidator Adapter', () => {
  test('Should return false if validator fails', () => {
    const sut = new EmailValidatorAdapter();
    jest.spyOn(validator, "isEmail").mockReturnValueOnce(false);
    const isValid = sut.isValid("invalid_email@gmail.com");
    expect(isValid).toBe(false);
  });
  test('Should return true if validator success', () => {
    const sut = new EmailValidatorAdapter();
    const isValid = sut.isValid("valid_email@email.com");
    expect(isValid).toBe(true);
  });
  test('Should validator calls with correct email', () => {
    const sut = new EmailValidatorAdapter();
    const isEmailSpy = jest.spyOn(validator, "isEmail");
    sut.isValid("any_email@email.com");
    expect(isEmailSpy).toHaveBeenCalledWith("any_email@email.com");
  });
});
