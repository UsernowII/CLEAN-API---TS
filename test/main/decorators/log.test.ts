import { LogControllerDecorator } from "../../../src/main/decorators/log";
import { Controller, HttpRequest, HttpResponse } from "../../../src/presentation/protocols";

describe('Log Controller Decorator', () => {
  test('Should call handle from controller', async () => {
    class ControllerStub implements Controller {
        async handle(req: HttpRequest): Promise< HttpResponse> { 
            const httpResponse: HttpResponse = {
                statusCode: 200,
                body: {
                    name: "Rengar"
                }
            }
            return Promise.resolve(httpResponse);
        }
    }
    const controllerStub = new ControllerStub();
    const handleSpy = jest.spyOn(controllerStub, 'handle');
    const sut = new LogControllerDecorator(controllerStub);
    const httpRequest: HttpRequest = {
        body : {
            email: "any_email@email.com",
            name: "any_name",
            password: "any_password",
            passswordConfirmation: "any_password"
        }
    } 
    await sut.handle(httpRequest);
    expect(handleSpy).toHaveBeenCalledWith(httpRequest);
  });
});
