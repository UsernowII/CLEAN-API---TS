import { LogMongoRepository } from "../../../infra/db/mongodb/log-repository/logMongoRepository";
import { Controller } from "../../../presentation/protocols";
import { LogControllerDecorator } from "../../decorators/logControllerDecorator";

export const makeLogControllerDecorator = (controller: Controller): Controller => {
    const logMongoRepository = new LogMongoRepository();
    return new LogControllerDecorator(controller, logMongoRepository);
};
