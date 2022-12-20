import { LogControllerDecorator } from "../../../src/main/decorators/log";
import { Controller, HttpRequest, HttpResponse } from "../../../src/presentation/protocols";
import { serverError } from "../../../src/presentation/helpers/http-helper";
import { LogErrorRepository } from "../../../src/data/protocols/logErrorRepository";

type SutTypes = {
	sut: LogControllerDecorator,
	logErrorRepoStub: LogErrorRepository,
	controllerStub: Controller,
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
}

const makeLogErrorRepository = (): LogErrorRepository => {
	class LogErrorRepositoryStub implements LogErrorRepository {
		async log(stack: string ): Promise<void> {
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
		const httpRequest: HttpRequest = {
			body: {
				email: "any_email@email.com",
				name: "any_name",
				password: "any_password",
				passswordConfirmation: "any_password"
			}
		};
		await sut.handle(httpRequest);
		expect(handleSpy).toHaveBeenCalledWith(httpRequest);
	});
	test('Should return the same result of the controller', async () => {
		const { sut } = makeSut();
		const httpRequest: HttpRequest = {
			body: {
				email: "any_email@email.com",
				name: "any_name",
				password: "any_password",
				passswordConfirmation: "any_password"
			}
		};
		const httpResponse = await sut.handle(httpRequest);
		expect(httpResponse).toEqual({
			statusCode: 200,
			body: {
				name: "Rengar"
			}
		});
	});
	test('Should call LogErrorRepository with correct error if controller return a server error', async () => {
		const { sut, controllerStub, logErrorRepoStub } = makeSut();
		const fakeError = new Error();
		fakeError.stack = "any_stack";
		const error = serverError(fakeError);
		const logSpy = jest.spyOn(logErrorRepoStub, "log");
		jest.spyOn(controllerStub, "handle").mockReturnValueOnce(Promise.resolve(error));
		const httpRequest: HttpRequest = {
			body: {
				email: "any_email@email.com",
				name: "any_name",
				password: "any_password",
				passswordConfirmation: "any_password"
			}
		};
		await sut.handle(httpRequest);
		expect(logSpy).toHaveBeenCalledWith("any_stack");
	});
});
