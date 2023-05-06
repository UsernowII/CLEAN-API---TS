import { DbAuthentication } from '../../../../src/data/usecases/auth/db-authentication';
import {
	AuthenticationModel, HashComparer, Encrypter,
	AccountModel, LoadAccountByEmailRepository, UpdateAccessTokenRepository
} from "../../../../src/data/usecases/auth/db-authentication-protocols";

interface SutTypes {
	sut: DbAuthentication,
	loadAccountByEmailRepoStub: LoadAccountByEmailRepository,
	hashComparerStub: HashComparer,
	encrypterStub: Encrypter,
	updateAccessTokenRepoStub: UpdateAccessTokenRepository
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
		async loadByEmail(email: string): Promise<AccountModel> {
			return Promise.resolve(makeFakeAccount())
		};
	}
	return new LoadAccountByEmailRepoStub();
};

const makeHashComparer = (): HashComparer => {
	class HashComparerStub implements HashComparer {
		compare(value: string, hash: string): Promise<boolean> {
			return Promise.resolve(true);
		}
	}
	return new HashComparerStub();
};

const makeEncrypter = (): Encrypter => {
	class EncrypterStub implements Encrypter {
		encrypt(value: string): Promise<string> {
			return Promise.resolve("any_token");
		}
	}
	return new EncrypterStub();
};

const makeUpdateAccessTokenRepository = (): UpdateAccessTokenRepository => {
	class UpdateAccessTokenRepoStub implements UpdateAccessTokenRepository {
		updateAccessToken(id: string, token: string): Promise<void> {
			return Promise.resolve();
		}
	}
	return new UpdateAccessTokenRepoStub();
};

const makeSut = (): SutTypes => {
	const loadAccountByEmailRepoStub = makeLoadAccountByEmailRepository();
	const hashComparerStub = makeHashComparer();
	const encrypterStub = makeEncrypter();
	const updateAccessTokenRepoStub = makeUpdateAccessTokenRepository();
	const sut = new DbAuthentication(
		loadAccountByEmailRepoStub,
		hashComparerStub,
		encrypterStub,
		updateAccessTokenRepoStub
	);
	return {
		sut,
		loadAccountByEmailRepoStub,
		hashComparerStub,
		encrypterStub: encrypterStub,
		updateAccessTokenRepoStub
	}
};

describe('Db authentication UseCase', () => {
	test('Should call LoadAccountByEmailRepository with correct email', async () => {
		const { sut, loadAccountByEmailRepoStub } = makeSut();
		const loadByEmailSpy = jest.spyOn(loadAccountByEmailRepoStub, "loadByEmail");
		await sut.auth(makeFakeAuthModel());
		expect(loadByEmailSpy).toHaveBeenCalledWith("any_email@email.com")
	});

	test('Should throw if LoadAccountByEmailRepository throws', async () => {
		const { sut, loadAccountByEmailRepoStub } = makeSut();
		jest.spyOn(loadAccountByEmailRepoStub, "loadByEmail").mockRejectedValueOnce(new Error());
		const promise = sut.auth(makeFakeAuthModel());
		await expect(promise).rejects.toThrowError();
	});

	test('Should return null if LoadAccountByEmailRepository return null', async () => {
		const { sut, loadAccountByEmailRepoStub } = makeSut();
		jest.spyOn(loadAccountByEmailRepoStub, "loadByEmail").mockReturnValueOnce(null!);
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
		jest.spyOn(hashComparerStub, "compare").mockReturnValueOnce(null!);
		const accessToken = await sut.auth(makeFakeAuthModel());
		expect(accessToken).toBeNull();
	});

	test('Should return null if HashComparer return false', async () => {
		const { sut, hashComparerStub } = makeSut();
		jest.spyOn(hashComparerStub, "compare").mockReturnValueOnce(Promise.resolve(false));
		const accessToken = await sut.auth(makeFakeAuthModel());
		expect(accessToken).toBeNull();
	});

	test('Should call Encrypter with correct value', async () => {
		const { sut, encrypterStub } = makeSut();
		const encryptSpy = jest.spyOn(encrypterStub, "encrypt");
		await sut.auth(makeFakeAuthModel());
		expect(encryptSpy).toHaveBeenCalledWith("any_id");
	});

	test('Should throw if Encrypter throws', async () => {
		const { sut, encrypterStub } = makeSut();
		jest.spyOn(encrypterStub, "encrypt").mockRejectedValueOnce(new Error());
		const promise = sut.auth(makeFakeAuthModel());
		await expect(promise).rejects.toThrowError();
	});

	test('Should return a token on success', async () => {
		const { sut } = makeSut();
		const accessToken = await sut.auth(makeFakeAuthModel());
		expect(accessToken).toBe("any_token");
	});

	test('Should call UpdateAccessTokenRepository with correct values', async () => {
		const { sut, updateAccessTokenRepoStub } = makeSut();
		const updateSpy = jest.spyOn(updateAccessTokenRepoStub, "updateAccessToken");
		await sut.auth(makeFakeAuthModel());
		expect(updateSpy).toHaveBeenCalledWith("any_id", "any_token");
	});

	test('Should throw if UpdateAccessTokenRepository throws', async () => {
		const { sut, updateAccessTokenRepoStub } = makeSut();
		jest.spyOn(updateAccessTokenRepoStub, "updateAccessToken").mockReturnValueOnce(Promise.reject(new Error()));
		const promise = sut.auth(makeFakeAuthModel());
		await expect(promise).rejects.toThrowError();
	});
});
