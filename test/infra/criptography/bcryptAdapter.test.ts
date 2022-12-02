import bcrypt from "bcrypt";
import { BcryptAdapter } from "../../../src/infra/criptography/bcryptAdapter";

jest.mock("bcrypt", ()=> ({
  hash (): Promise<string> {
    return new Promise( resolve => resolve("hash_value"));
  }
}));

describe('Bcrypt Adapter', () => {
  test('Should call bcrypt with correct values', async () => {
      const salt = 5;
      const sut = new BcryptAdapter(salt);
      const hashSpy = jest.spyOn(bcrypt, "hash");
      await sut.encrypt("any_value");
      expect(hashSpy).toHaveBeenCalledWith("any_value", salt);
  });
  test('Should return a hash on success', async () => {
      const salt = 5;
      const sut = new BcryptAdapter(salt);
      const hash = await sut.encrypt("any_value");
      expect(hash).toBe("hash_value");
  });
});
