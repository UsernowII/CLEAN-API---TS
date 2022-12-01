import { EmailValidatorAdapter } from "../../../src/utils/emailValidatorAdapter";

describe('EmailValidator Adapter', () => {
  test('Should return false if validator return false', () => {
    const sut = new EmailValidatorAdapter();
    const isValid = sut.isValid('invalid_email.com');
    expect(isValid).toBe(false);
  });
});
