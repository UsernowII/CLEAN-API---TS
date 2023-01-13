import { HashComparer } from '../../../../src/data/protocols/criptography/hashComparer';
import { LoadAccountByEmailRepository } from '../../../../src/data/protocols/db/loadAccountByEmailRepository';
import { DbAuthentication } from '../../../../src/data/usecases/auth/db-authentication';
import { AccountModel } from '../../../../src/domain/models/account';
import { AuthenticationModel } from '../../../../src/domain/usecases/authentication';

interface SutTypes {
	sut: DbAuthentication,
	loadAccountByEmailRepoStub: LoadAccountByEmailRepository,
	hashComparerStub: HashComparer
}

const makeFakeAccount = (): AccountModel => ({
	email: "any_email@email.com",
	id: "any_id",
	name: "any_name",
	password: "hashed_password",
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

const makeHashComparer = (): HashComparer => {
	class HashComparerStub implements HashComparer {
		compare (value: string, hash: string): Promise<boolean> {
			return Promise.resolve(true);
		} 
	}
	return new HashComparerStub();
}

const makeSut = (): SutTypes => {
	const loadAccountByEmailRepoStub = makeLoadAccountByEmailRepository();
	const hashComparerStub = makeHashComparer();
	const sut = new DbAuthentication(loadAccountByEmailRepoStub, hashComparerStub);
	return {
		sut,
		loadAccountByEmailRepoStub,
		hashComparerStub
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

	test('Should return null if LoadAccountByEmailRepository return null', async () => {
		const { sut, loadAccountByEmailRepoStub } = makeSut();
		jest.spyOn(loadAccountByEmailRepoStub, "load").mockReturnValueOnce(null);
		const accessToken = await sut.auth(makeFakeAuthModel());
		expect(accessToken).toBeNull();
	});

	test('Should call HashComparer with correct values', async () => {
		const { sut, hashComparerStub } = makeSut();
		const hashSpy = jest.spyOn(hashComparerStub, "compare");
		await sut.auth(makeFakeAuthModel());
		expect(hashSpy).toHaveBeenCalledWith("any_password", "hashed_password");
	});

	test('Should return null if HashComparer return null', async () => {
		const { sut, hashComparerStub } = makeSut();
		jest.spyOn(hashComparerStub, "compare").mockReturnValueOnce(null);
		const accessToken = await sut.auth(makeFakeAuthModel());
		expect(accessToken).toBeNull();
	});
});
