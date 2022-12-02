import { DbAddAccount } from "../../../src/data/usecases/add-account/db-add-account";
import { AccountModel, AddAccountModel, AddAccountRepository, Encrypter} from "../../../src/data/usecases/add-account/db-add-account-protocols";

type SutTypes = {
  sut: DbAddAccount,
  encrypterStub: Encrypter,
  addAccRepoStub: AddAccountRepository
}

const makeEncrypter = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt(value: string): Promise<string> {
        return Promise.resolve("hashed_password");
    }
  }
  return new EncrypterStub();
}

const makeAddAccountRepository = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add(account: AddAccountModel): Promise<AccountModel> {
      const fakeAccount= {
        id: "valid_id",
        name: "valid_name",
        email: "valid_email",
        password: "hashed_password",
      }
      return new Promise( resolve => resolve(fakeAccount));
    }
  }
  return new AddAccountRepositoryStub();
}

const makeSut = (): SutTypes => {
  const encrypterStub = makeEncrypter();
  const addAccRepoStub = makeAddAccountRepository();
  const sut = new DbAddAccount(encrypterStub, addAccRepoStub);
  return {
    sut,
    encrypterStub,
    addAccRepoStub,
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
  test('Should call AddAccountRepository with correct values', async () => {
    const { sut, addAccRepoStub } = makeSut();
    const addSpy = jest.spyOn(addAccRepoStub, "add");
    const accountData = {
      name: "valid_name",
      email: "valid_email",
      password: "hashed_password"
    }
    await sut.add(accountData);
    expect(addSpy).toHaveBeenCalledWith(accountData);
  });
  test('Should throw if AddAccountRepository throws', async () => {
    const { sut, addAccRepoStub } = makeSut();
    jest.spyOn( addAccRepoStub, "add").mockReturnValueOnce(Promise.reject(new Error()));
    const accountData = {
      name: "valid_name",
      email: "valid_email",
      password: "hashed_password"
    }
    const promise = sut.add(accountData);
    await expect(promise).rejects.toThrow();
  });
});
