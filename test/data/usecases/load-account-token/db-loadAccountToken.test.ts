import { DbLoadAccountToken} from "../../../../src/data/usecases/load-account-token/db-loadAccountToken"
import { Decrypter } from '../../../../src/data/protocols/criptography/decrypter';


describe('Db LoadAccountToken UseCase', () => {
  test('Should call Decrypter with correct values', async () => {
    class DecrypterStub implements Decrypter {
      async decrypt (value: string): Promise<string> {
        return Promise.resolve("any_value");
      };  
    }
    
    const decreypterStub = new DecrypterStub();
    const decryptSpy = jest.spyOn(decreypterStub, "decrypt");
    const sut = new DbLoadAccountToken(decreypterStub);
    await sut.load('any_token');
    expect(decryptSpy).toHaveBeenCalledWith("any_token");
  });
});
