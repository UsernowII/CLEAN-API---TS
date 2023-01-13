import { HashComparer } from '../../../../src/data/protocols/criptography/hashComparer';
import { TokenGenerator } from '../../../../src/data/protocols/criptography/tokenGenerator';
import { LoadAccountByEmailRepository } from '../../../../src/data/protocols/db/loadAccountByEmailRepository';
import { DbAuthentication } from '../../../../src/data/usecases/auth/db-authentication';
import { AccountModel } from '../../../../src/domain/models/account';
import { AuthenticationModel } from '../../../../src/domain/usecases/authentication';

interface SutTypes {
	sut: DbAuthentication,
	loadAccountByEmailRepoStub: LoadAccountByEmailRepository,
	hashComparerStub: HashComparer,
	tokenGeneratorStub: TokenGenerator
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
};

const makeTokenGenerator = (): TokenGenerator => {
	class TokenGeneratorStub implements TokenGenerator {
		generate (id: string): Promise<string> {
			return Promise.resolve("any_token");
		} 
	}
	return new TokenGeneratorStub();
}

const makeSut = (): SutTypes => {
	const loadAccountByEmailRepoStub = makeLoadAccountByEmailRepository();
	const hashComparerStub = makeHashComparer();
	const tokenGeneratorStub = makeTokenGenerator();
	const sut = new DbAuthentication(
		loadAccountByEmailRepoStub, 
		hashComparerStub, 
		tokenGeneratorStub);
	return {
		sut,
		loadAccountByEmailRepoStub,
		hashComparerStub,
		tokenGeneratorStub
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

	test('Should return null if HashComparer return false', async () => {
		const { sut, hashComparerStub } = makeSut();
		jest.spyOn(hashComparerStub, "compare").mockReturnValueOnce(Promise.resolve(false));
		const accessToken = await sut.auth(makeFakeAuthModel());
		expect(accessToken).toBeNull();
	});

	test('Should call TokenGenerator with correct id', async () => {
		const { sut, tokenGeneratorStub } = makeSut();
		const generateSpy = jest.spyOn(tokenGeneratorStub, "generate");
		await sut.auth(makeFakeAuthModel());
		expect(generateSpy).toHaveBeenCalledWith("any_id");
	});

	test('Should throw if TokenGenerator throws', async () => {
		const { sut, tokenGeneratorStub } = makeSut();
		jest.spyOn(tokenGeneratorStub, "generate").mockRejectedValueOnce(new Error());
		const promise = sut.auth(makeFakeAuthModel());
		await expect(promise).rejects.toThrowError();
	});
});
