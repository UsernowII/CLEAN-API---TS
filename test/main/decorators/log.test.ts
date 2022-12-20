import { LogControllerDecorator } from "../../../src/main/decorators/log";
import { Controller, HttpRequest, HttpResponse } from "../../../src/presentation/protocols";
import { serverError } from "../../../src/presentation/helpers/http-helper";
import { LogErrorRepository } from "../../../src/data/protocols/logErrorRepository";

type SutTypes = {
	sut: LogControllerDecorator,
	logErrorRepoStub: LogErrorRepository,
	controllerStub: Controller,
}

const makeFakeRequest = (): HttpRequest => ({
	body: {
		name: "any_name",
		email: "any_email@email.com",
		password: "any_password",
		passwordConfirmation: "any_password"
	}
});

const makeFakeServerError = (): HttpResponse => {
	const fakeError = new Error();
	fakeError.stack = "any_stack";
	return serverError(fakeError);
}

const makeController = (): Controller => {
	class ControllerStub implements Controller {
		async handle(req: HttpRequest): Promise<HttpResponse> {
			const httpResponse: HttpResponse = {
				statusCode: 200,
				body: {
					name: "Rengar"
				}
			}
			return Promise.resolve(httpResponse);
		}
	}
	return new ControllerStub();
};

const makeLogErrorRepository = (): LogErrorRepository => {
	class LogErrorRepositoryStub implements LogErrorRepository {
		async log(stack: string): Promise<void> {
			return Promise.resolve();
		}
	};
	return new LogErrorRepositoryStub();
};

const makeSut = (): SutTypes => {
	const controllerStub = makeController();
	const logErrorRepoStub = makeLogErrorRepository();
	const sut = new LogControllerDecorator(controllerStub, logErrorRepoStub);
	return {
		sut,
		logErrorRepoStub,
		controllerStub,
	}
};

describe('Log Controller Decorator', () => {
	test('Should call handle from controller', async () => {
		const { controllerStub, sut } = makeSut();
		const handleSpy = jest.spyOn(controllerStub, 'handle');
		const httpRequest: HttpRequest = makeFakeRequest();
		await sut.handle(httpRequest);
		expect(handleSpy).toHaveBeenCalledWith(httpRequest);
	});
	test('Should return the same result of the controller', async () => {
		const { sut } = makeSut();
		const httpResponse = await sut.handle(makeFakeRequest());
		expect(httpResponse).toEqual({
			statusCode: 200,
			body: {
				name: "Rengar"
			}
		});
	});
	test('Should call LogErrorRepository with correct error if controller return a server error', async () => {
		const { sut, controllerStub, logErrorRepoStub } = makeSut();
		const logSpy = jest.spyOn(logErrorRepoStub, "log");
		jest.spyOn(controllerStub, "handle").mockReturnValueOnce(Promise.resolve(makeFakeServerError()));
		await sut.handle(makeFakeRequest());
		expect(logSpy).toHaveBeenCalledWith("any_stack");
	});
});
