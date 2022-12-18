import { LogControllerDecorator } from "../../../src/main/decorators/log";
import { Controller, HttpRequest, HttpResponse } from "../../../src/presentation/protocols";

type SutTypes = {
	sut: LogControllerDecorator,
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

const makeSut = (): SutTypes => {
	const controllerStub = makeController();
	const sut = new LogControllerDecorator(controllerStub);
	return {
		sut,
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
});
