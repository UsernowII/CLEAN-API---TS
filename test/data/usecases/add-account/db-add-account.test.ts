import { DbAddAccount } from "../../../../src/data/usecases/add-account/db-add-account";
import { AccountModel, AddAccountModel, AddAccountRepository, Hasher } from "../../../../src/data/usecases/add-account/db-add-account-protocols";

type SutTypes = {
  sut: DbAddAccount,
  hasherStub: Hasher,
  addAccRepoStub: AddAccountRepository
}

const makeHasher = (): Hasher => {
  class HasherStub implements Hasher {
    async hash(value: string): Promise<string> {
      return Promise.resolve("hashed_password");
    }
  }
  return new HasherStub();
}

const makeAddAccountRepository = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add(account: AddAccountModel): Promise<AccountModel> {
      return Promise.resolve(makeFakeAccount());
    }
  }
  return new AddAccountRepositoryStub();
}

const makeFakeAccount = (): AccountModel => ({
  id: "valid_id",
  name: "valid_name",
  email: "valid_email",
  password: "hashed_password",
});

const makeFakeAccountData = (): AddAccountModel => ({
  name: "valid_name",
  email: "valid_email",
  password: "valid_password"
});

const makeSut = (): SutTypes => {
  const hasherStub = makeHasher();
  const addAccRepoStub = makeAddAccountRepository();
  const sut = new DbAddAccount(hasherStub, addAccRepoStub);
  return {
    sut,
    hasherStub: hasherStub,
    addAccRepoStub,
  }
};

describe('DB AddAccount UseCase', () => {
  test('Should call Hasher with correct password', () => {
    const { sut, hasherStub } = makeSut();
    const hashSpy = jest.spyOn(hasherStub, "hash");
    sut.add(makeFakeAccountData());
    expect(hashSpy).toBeCalledWith("valid_password");
  });
  test('Should throw if Hasher throws', async () => {
    const { sut, hasherStub } = makeSut();
    jest.spyOn(hasherStub, "hash").mockReturnValueOnce(Promise.reject(new Error()));
    const promise = sut.add(makeFakeAccountData());
    await expect(promise).rejects.toThrow();
  });
  test('Should call AddAccountRepository with correct values', async () => {
    const { sut, addAccRepoStub } = makeSut();
    const addSpy = jest.spyOn(addAccRepoStub, "add");
    const accountData = makeFakeAccountData();
    accountData.password = "hashed_password";
    await sut.add(accountData);
    expect(addSpy).toHaveBeenCalledWith(accountData);
  });
  test('Should throw if AddAccountRepository throws', async () => {
    const { sut, addAccRepoStub } = makeSut();
    jest.spyOn(addAccRepoStub, "add").mockReturnValueOnce(Promise.reject(new Error()));
    const promise = sut.add(makeFakeAccountData());
    await expect(promise).rejects.toThrow();
  });
  test('Should return an account on success', async () => {
    const { sut } = makeSut();
    const account = await sut.add(makeFakeAccountData());
    expect(account).toEqual(makeFakeAccount());
  });
});
