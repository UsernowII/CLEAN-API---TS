import { DbAddAccount } from "../../../../data/usecases/add-account/db-add-account";
import { BcryptAdapter } from "../../../../infra/criptography/bcrypt-adapter/bcryptAdapter";
import { AccountMongoRepository } from "../../../../infra/db/mongodb/account-repository/accountMongoRepository";
import { AddAccount } from "../../../../domain/usecases/addAccount";

export const makeDbAddAccount = (): AddAccount => {
    const salt = 12;
    const bcryptAdapter = new BcryptAdapter(salt);
    const accountMongoRepo = new AccountMongoRepository();
    return new DbAddAccount(bcryptAdapter, accountMongoRepo, accountMongoRepo);
};
