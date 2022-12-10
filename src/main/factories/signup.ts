import { SignUpController } from "../../presentation/controllers/signup/SingUp";
import { EmailValidatorAdapter } from "../../utils/emailValidatorAdapter";
import { DbAddAccount } from "../../data/usecases/add-account/db-add-account";
import { BcryptAdapter } from "../../infra/criptography/bcryptAdapter";
import { AccountMongoRepository } from "../../infra/db/mongodb/accountMongoRepository";

export const makeSignUpController = (): SignUpController => {
    const salt = 5;
    const emailValidatorAdapter = new EmailValidatorAdapter();
    const bcryptAdapter = new BcryptAdapter(salt);
    const accountMongoRepo = new AccountMongoRepository();
    const dbAddAccount = new DbAddAccount(bcryptAdapter, accountMongoRepo);
    return new SignUpController(emailValidatorAdapter, dbAddAccount);
};
