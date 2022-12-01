import { DbAddAccount } from "../../../src/data/usecases/add-account/db-add-account";

describe('DB AddAccount UseCase', () => {
  test('Should call Encrypter with correct password', () => {
    class EncrypterStub {
        async encrypt(value: string): Promise<string> {
            return Promise.resolve("Hashed_password");
        }
    }
    const encrypterStub = new EncrypterStub();
    const sut = new DbAddAccount(encrypterStub);
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
