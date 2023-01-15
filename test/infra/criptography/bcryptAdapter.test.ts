import bcrypt from "bcrypt";
import { BcryptAdapter } from "../../../src/infra/criptography/bcrypt-adapter/bcryptAdapter";

jest.mock("bcrypt", () => ({
  async hash():Promise<string>  {
    return Promise.resolve("hash_value");
  },

  async compare(a: string, b: string): Promise<boolean> {
    return Promise.resolve(true);
  }
}));

const salt = 5;
const makeSut = (): BcryptAdapter => {
  return new BcryptAdapter(salt);
}

describe('Bcrypt Adapter', () => {
  test('Should call hash with correct values', async () => {
    const sut = makeSut();
    const hashSpy = jest.spyOn(bcrypt, "hash");
    await sut.hash("any_value");
    expect(hashSpy).toHaveBeenCalledWith("any_value", salt);
  });
  test('Should return a valid hash when hash success', async () => {
    const sut = makeSut();
    const hash = await sut.hash("any_value");
    expect(hash).toBe("hash_value");
  });
  test('Should throw if hasher throws', async () => {
    const sut = makeSut();
    jest.spyOn(bcrypt, "hash").mockImplementationOnce(()=> {
      throw new Error();
    });
    const promise = sut.hash("any_value");
    await expect(promise).rejects.toThrow();
  });

  test('Should call compare with correct values', async () => {
    const sut = makeSut();
    const compareSpy = jest.spyOn(bcrypt, "compare");
    await sut.compare("any_value", "any_hash");
    expect(compareSpy).toHaveBeenCalledWith("any_value", "any_hash");
  });
  test('Should return true when compare success', async () => {
    const sut = makeSut();
    const isValid = await sut.compare("any_value", "any_hash");
    expect(isValid).toBeTruthy();
  });
  test('Should return false when compare fails', async () => {
    const sut = makeSut();
    jest.spyOn(bcrypt, "compare").mockImplementationOnce(() => Promise.resolve(false));
    const isValid = await sut.compare("any_value", "any_hash");
    expect(isValid).toBeFalsy();
  });
  test('Should throw if compare throws', async () => {
    const sut = makeSut();
    jest.spyOn(bcrypt, "compare").mockImplementationOnce(()=> {
      throw new Error();
    });
    const promise = sut.compare("any_value", "any_hash");
    await expect(promise).rejects.toThrow();
  });

});
