import bcrypt from "bcrypt";
import { BcryptAdapter } from "../../../src/infra/criptography/bcryptAdapter";

jest.mock("bcrypt", () => ({
  hash():Promise<string>  {
    return Promise.resolve("hash_value");
  }
}));

const salt = 5;
const makeSut = (): BcryptAdapter => {
  return new BcryptAdapter(salt);
}

describe('Bcrypt Adapter', () => {
  test('Should call bcrypt with correct values', async () => {
    const sut = makeSut();
    const hashSpy = jest.spyOn(bcrypt, "hash");
    await sut.encrypt("any_value");
    expect(hashSpy).toHaveBeenCalledWith("any_value", salt);
  });
  test('Should return a hash on success', async () => {
    const sut = makeSut();
    const hash = await sut.encrypt("any_value");
    expect(hash).toBe("hash_value");
  });
  test('Should throw if bcrypt throws', async () => {
    const sut = makeSut();
    jest.spyOn(bcrypt, "hash").mockImplementationOnce(()=> {
      throw new Error();
    });
    const promise = sut.encrypt("any_value");
    await expect(promise).rejects.toThrow();
  });
});
