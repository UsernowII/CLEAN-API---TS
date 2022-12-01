import { Encrypter } from "../../../src/data/protocols/encrypter";
import { DbAddAccount } from "../../../src/data/usecases/add-account/db-add-account";

type SutTypes = {
  sut: DbAddAccount,
  encrypterStub: Encrypter,
}

const makeSut = (): SutTypes => {
  class EncrypterStub {
    async encrypt(value: string): Promise<string> {
        return Promise.resolve("Hashed_password");
    }
  }
  const encrypterStub = new EncrypterStub();
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
});
