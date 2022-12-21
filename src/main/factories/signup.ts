import { SignUpController } from "../../presentation/controllers/signup/SingUp";
import { EmailValidatorAdapter } from "../../utils/emailValidatorAdapter";
import { DbAddAccount } from "../../data/usecases/add-account/db-add-account";
import { BcryptAdapter } from "../../infra/criptography/bcryptAdapter";
import { AccountMongoRepository } from "../../infra/db/mongodb/account-repository/accountMongoRepository";
import { LogMongoRepository } from "../../infra/db/mongodb/log-repository/logMongoRepository";
import { LogControllerDecorator } from "../decorators/log";
import { Controller } from "../../presentation/protocols";

export const makeSignUpController = (): Controller => {
    const salt = 5;
    const emailValidatorAdapter = new EmailValidatorAdapter();
    const bcryptAdapter = new BcryptAdapter(salt);
    const accountMongoRepo = new AccountMongoRepository();
    const dbAddAccount = new DbAddAccount(bcryptAdapter, accountMongoRepo);
    const signUpController = new SignUpController(emailValidatorAdapter, dbAddAccount);
    const logMongoRepository = new LogMongoRepository();
    return new LogControllerDecorator(signUpController, logMongoRepository);
};
