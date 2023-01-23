import { Controller } from "../../../presentation/protocols";
import { LoginController } from "../../../presentation/controllers/login/Login-controller";
import { LogControllerDecorator } from "../../decorators/logControllerDecorator";
import { makeLoginValidation } from "./login-validation-factory";
import { DbAuthentication } from "../../../data/usecases/auth/db-authentication";
import { LogMongoRepository } from "../../../infra/db/mongodb/log-repository/logMongoRepository";
import { AccountMongoRepository } from "../../../infra/db/mongodb/account-repository/accountMongoRepository";
import { BcryptAdapter } from "../../../infra/criptography/bcrypt-adapter/bcryptAdapter";
import { JwtAdapter } from "../../../infra/criptography/jwt-adapter/jwtAdapter";
import env from "../../config/env";

export const makeLoginController = (): Controller => {
    const salt = 12;
    const bcryptAdapter = new BcryptAdapter(salt);
    const jwtAdapter = new JwtAdapter(env.jwtSecret);
    const accountMongoRepository = new AccountMongoRepository();
    const dbAuthentication = new DbAuthentication(accountMongoRepository, bcryptAdapter, jwtAdapter, accountMongoRepository);
    const loginController = new LoginController(dbAuthentication, makeLoginValidation());
    const logMongoRepository = new LogMongoRepository();
    return new LogControllerDecorator(loginController, logMongoRepository);
};
