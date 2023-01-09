import { SignUpController } from "../../presentation/controllers/signup/SingUp";
import { DbAddAccount } from "../../data/usecases/add-account/db-add-account";
import { BcryptAdapter } from "../../infra/criptography/bcryptAdapter";
import { AccountMongoRepository } from "../../infra/db/mongodb/account-repository/accountMongoRepository";
import { LogMongoRepository } from "../../infra/db/mongodb/log-repository/logMongoRepository";
import { LogControllerDecorator } from "../decorators/log";
import { Controller } from "../../presentation/protocols";
import { makeSignUpValidation } from "./signup-validation";

export const makeSignUpController = (): Controller => {
    const salt = 5;
    const bcryptAdapter = new BcryptAdapter(salt);
    const accountMongoRepo = new AccountMongoRepository();
    const dbAddAccount = new DbAddAccount(bcryptAdapter, accountMongoRepo);
    const validationComposite = makeSignUpValidation();
    const signUpController = new SignUpController(dbAddAccount, validationComposite);
    const logMongoRepository = new LogMongoRepository();
    return new LogControllerDecorator(signUpController, logMongoRepository);
};
