import { LoadAccountByEmailRepository } from '../../../../src/data/protocols/loadAccountByEmailRepository';
import { DbAuthentication } from '../../../../src/data/usecases/auth/db-authentication';
import { AccountModel } from '../../../../src/domain/models/account';
describe('Db authentication UseCase', () => {
	test('Should call LoadAccountByEmailRepository with correct email', async () => {

		class LoadAccountByEmailRepoStub implements LoadAccountByEmailRepository {
			async load(email: string): Promise<AccountModel> {
				const account: AccountModel = {
					email: "any_email@email.com",
					id: "any_id",
					name: "any_name",
					password: "any_password",
				}
				return Promise.resolve(account)
			};
		}

		const loadAccountByEmailRepoStub = new LoadAccountByEmailRepoStub();
		const sut = new DbAuthentication(loadAccountByEmailRepoStub);
		const loadSpy = jest.spyOn(loadAccountByEmailRepoStub, "load");
		await sut.auth({
			email: "any_email@email.com",
			password: "any_password"
		});
		expect(loadSpy).toHaveBeenCalledWith("any_email@email.com")
	});
});
