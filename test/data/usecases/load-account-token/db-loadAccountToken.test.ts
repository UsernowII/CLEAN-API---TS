import { DbLoadAccountToken} from "../../../../src/data/usecases/load-account-token/db-loadAccountToken"
import { Decrypter } from '../../../../src/data/protocols/criptography/decrypter';
import { LoadAccountByTokenRepository } from '../../../../src/data/protocols/db/account/loadAccountByTokenRepository';
import { AccountModel } from '../../../../src/domain/models/account';

interface SutTypes {
  sut: DbLoadAccountToken,
  decreypterStub: Decrypter,
  loadAccountByTokenRepoStub: LoadAccountByTokenRepository,
}

const makeFakeAccount = (): AccountModel => ({
  id: "valid_id",
  name: "valid_name",
  email: "valid_email@email.com",
  password: "hashed_password",
});

const makeLoadAccountByTokenRepository = () => {
  class LoadAccountByTokenRepositoryStub implements LoadAccountByTokenRepository {
    async loadByToken (token: string, role?: string): Promise<AccountModel> {
      return Promise.resolve(makeFakeAccount());
    };  
  }
  return new LoadAccountByTokenRepositoryStub();
}
const makeDecrypter = () => {
  class DecrypterStub implements Decrypter {
    async decrypt (value: string): Promise<string> {
      return Promise.resolve("any_token");
    };  
  }
  return new DecrypterStub();
}

const makeSut = (): SutTypes => {
  const decreypterStub = makeDecrypter();
  const loadAccountByTokenRepoStub = makeLoadAccountByTokenRepository()
  const sut = new DbLoadAccountToken(decreypterStub, loadAccountByTokenRepoStub);
  return { sut, decreypterStub, loadAccountByTokenRepoStub };
}

describe('Db LoadAccountToken UseCase', () => {
  test('Should call Decrypter with correct values', async () => {
    const { sut, decreypterStub } = makeSut();
    const decryptSpy = jest.spyOn(decreypterStub, "decrypt");
    await sut.load('any_token', 'any_role');
    expect(decryptSpy).toHaveBeenCalledWith("any_token");
  });
  test('Should return null if Decrypter return null', async () => {
    const { sut, decreypterStub } = makeSut();
    jest.spyOn(decreypterStub, "decrypt").mockResolvedValueOnce(null);
    const account = await sut.load('any_token', 'any_role');
    expect(account).toBeNull();
  });
  test('Should call LoadAccountByTokenRepo with correct values', async () => {
    const { sut, loadAccountByTokenRepoStub } = makeSut();
    const loadRepoSpy = jest.spyOn(loadAccountByTokenRepoStub, "loadByToken");
    await sut.load('any_token', 'any_role');
    expect(loadRepoSpy).toHaveBeenCalledWith("any_token", "any_role");
  });
});
