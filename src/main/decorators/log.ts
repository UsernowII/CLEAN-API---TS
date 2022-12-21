import { Controller, HttpRequest, HttpResponse } from "../../presentation/protocols";
import { LogErrorRepository } from "../../data/protocols/logErrorRepository";

export class LogControllerDecorator implements Controller {
    private readonly controller: Controller;
    private readonly logError: LogErrorRepository;

    constructor (controller: Controller, logError: LogErrorRepository) {
        this.controller = controller;
        this.logError = logError;
    }

    async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
        const httpResponse = await this.controller.handle(httpRequest);
        if (httpResponse.statusCode === 500) {
            await this.logError.logError(httpResponse.body.stack);
        }
        return httpResponse;
    };
}
