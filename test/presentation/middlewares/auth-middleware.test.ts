import { HttpRequest } from '../../../src/presentation/protocols/http';
import { AuthMiddleware } from "../../../src/presentation/middlewares/auth-middleware";
import { forbidden, ok, serverError } from '../../../src/presentation/helpers/http/http-helper';
import { AccessDeniedError } from '../../../src/presentation/errors';
import { LoadAccountByToken } from '../../domain/usecases/loadAccountByToken';
import { AccountModel } from '../../domain/models/account';

interface SutTypes {
	sut: AuthMiddleware;
	loadAccountByTokenStub: LoadAccountByToken;
}

const makeFakeAccount = (): AccountModel => ({
	id: "valid_id",
	name: "valid_name",
	email: "valid_email@email.com",
	password: "valid_password",
});

const makeFakeRequest = (): HttpRequest => ({
	headers: { "x-access-token": "any_token" }
});

const makeLoadAccountByToken = (): LoadAccountByToken => {
	class LoadAccountByTokenStub implements LoadAccountByToken {
		load(accessToken: string, role?: string): Promise<AccountModel> {
			return Promise.resolve(makeFakeAccount());
		}
	}
	return new LoadAccountByTokenStub();
}


const makeSut = () => {
	const loadAccountByTokenStub = makeLoadAccountByToken();
	const sut = new AuthMiddleware(loadAccountByTokenStub);
	return {
		sut, loadAccountByTokenStub
	}

}

describe('Auth Middleware', () => {
	test('Should return 403 if no x-access-token exist', async () => {
		const { sut } = makeSut();
		const httpRequest: HttpRequest = {}
		const httpResponse = await sut.handle(httpRequest);
		expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
	});
	test('Should call LoadAccountByToken with correct accessToken', async () => {
		const { sut, loadAccountByTokenStub } = makeSut();
		const loadSpy = jest.spyOn(loadAccountByTokenStub, "load");
		await sut.handle(makeFakeRequest());
		expect(loadSpy).toHaveBeenCalledWith("any_token");
	});
	test('Should return 403 if LoadAccountByToken return null', async () => {
		const { sut, loadAccountByTokenStub } = makeSut();
		jest.spyOn(loadAccountByTokenStub, "load").mockResolvedValueOnce(null);
		const httpResponse = await sut.handle(makeFakeRequest());
		expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
	});
	test('Should return 200 if LoadAccountByToken return an account', async () => {
		const { sut } = makeSut();
		const httpResponse = await sut.handle(makeFakeRequest());
		expect(httpResponse).toEqual(ok({
			accountId : "valid_id"
		}))
	});
	test('Should return 500 if LoadAccountByToken throws', async () => {
		const { sut, loadAccountByTokenStub } = makeSut();
		jest.spyOn(loadAccountByTokenStub, "load").mockRejectedValueOnce(new Error());
		const httpResponse = await sut.handle(makeFakeRequest());
		expect(httpResponse).toEqual(serverError(new Error()))
	});

});
