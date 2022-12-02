import bcrypt from "bcrypt";
import { BcryptAdapter } from "../../../src/infra/criptography/bcryptAdapter";

describe('Bcrypt Adapter', () => {
  test('Should call bcrypt with correct values', async () => {
    const salt = 5;
    const sut = new BcryptAdapter(salt);
    const hashSpy = jest.spyOn(bcrypt, "hash");
    await sut.encrypt("any_password");
    expect(hashSpy).toHaveBeenCalledWith("any_password", salt);
  });
});
