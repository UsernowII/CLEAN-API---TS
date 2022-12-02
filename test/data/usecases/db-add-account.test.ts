import { DbAddAccount } from "../../../src/data/usecases/add-account/db-add-account";
import { Encrypter } from "../../../src/data/protocols/encrypter";

type SutTypes = {
  sut: DbAddAccount,
  encrypterStub: Encrypter,
}

const makeEncrypter = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt(value: string): Promise<string> {
        return Promise.resolve("Hashed_password");
    }
  }
  return new EncrypterStub();
}

const makeSut = (): SutTypes => {
  const encrypterStub = makeEncrypter();
  const sut = new DbAddAccount(encrypterStub);
  return {
    sut,
    encrypterStub,
  }
}

describe('DB AddAccount UseCase', () => {
  test('Should call Encrypter with correct password', () => {
    const { sut, encrypterStub } = makeSut();
    const encryptSpy = jest.spyOn(encrypterStub, "encrypt");
    const accountData = {
      name: "valid_name",
      email: "valid_email",
      password: "valid_password"
    }
    sut.add(accountData);
    expect(encryptSpy).toBeCalledWith("valid_password");
  });
  test('Should throw if Encrypter throws', async () => {
    const { sut, encrypterStub } = makeSut();
    jest.spyOn(encrypterStub, "encrypt").mockReturnValueOnce(Promise.reject(new Error()));
    const accountData = {
      name: "valid_name",
      email: "valid_email",
      password: "valid_password"
    }
    const promise = sut.add(accountData);
    await expect(promise).rejects.toThrow();
  });
});
