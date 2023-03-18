import { DbLoadAccountToken} from "../../../../src/data/usecases/load-account-token/db-loadAccountToken"
import { Decrypter } from '../../../../src/data/protocols/criptography/decrypter';

interface SutTypes {
  sut: DbLoadAccountToken,
  decreypterStub: Decrypter,
}

const makeDecrypter = () => {
  class DecrypterStub implements Decrypter {
    async decrypt (value: string): Promise<string> {
      return Promise.resolve("any_value");
    };  
  }
  return new DecrypterStub();
}

const makeSut = (): SutTypes => {
  const decreypterStub = makeDecrypter();
  const sut = new DbLoadAccountToken(decreypterStub);
  return { sut, decreypterStub };
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
});
