import { LoadAccountByEmailRepository } from '../../../../src/data/protocols/db/loadAccountByEmailRepository';
import { DbAuthentication } from '../../../../src/data/usecases/auth/db-authentication';
import { AccountModel } from '../../../../src/domain/models/account';
import { AuthenticationModel } from '../../../../src/domain/usecases/authentication';

interface SutTypes {
	sut: DbAuthentication,
	loadAccountByEmailRepoStub: LoadAccountByEmailRepository
}

const makeFakeAccount = (): AccountModel => ({
	email: "any_email@email.com",
	id: "any_id",
	name: "any_name",
	password: "any_password",
});

const makeFakeAuthModel = (): AuthenticationModel => ({
	email: "any_email@email.com",
	password: "any_password"
});

const makeLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
	class LoadAccountByEmailRepoStub implements LoadAccountByEmailRepository {
		async load(email: string): Promise<AccountModel> {
			return Promise.resolve(makeFakeAccount())
		};
	}
	return new LoadAccountByEmailRepoStub();
};

const makeSut = (): SutTypes => {
	const loadAccountByEmailRepoStub = makeLoadAccountByEmailRepository();
	const sut = new DbAuthentication(loadAccountByEmailRepoStub);
	return {
		sut,
		loadAccountByEmailRepoStub
	}
};

describe('Db authentication UseCase', () => {
	test('Should call LoadAccountByEmailRepository with correct email', async () => {
		const { sut, loadAccountByEmailRepoStub } = makeSut();
		const loadSpy = jest.spyOn(loadAccountByEmailRepoStub, "load");
		await sut.auth(makeFakeAuthModel());
		expect(loadSpy).toHaveBeenCalledWith("any_email@email.com")
	});

	test('Should throw if LoadAccountByEmailRepository throws', async () => {
		const { sut, loadAccountByEmailRepoStub } = makeSut();
		jest.spyOn(loadAccountByEmailRepoStub, "load").mockRejectedValueOnce(new Error());
		const promise = sut.auth(makeFakeAuthModel());
		await expect(promise).rejects.toThrowError();
	});
});
