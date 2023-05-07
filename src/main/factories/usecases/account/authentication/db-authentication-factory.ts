import { DbAuthentication } from "../../../../../data/usecases/auth/db-authentication";
import { Authentication } from "../../../../../data/usecases/auth/db-authentication-protocols";
import { AccountMongoRepository } from "../../../../../infra/db/mongodb/account-repository/accountMongoRepository";
import { BcryptAdapter } from "../../../../../infra/criptography/bcrypt-adapter/bcryptAdapter";
import { JwtAdapter } from "../../../../../infra/criptography/jwt-adapter/jwtAdapter";
import env from "../../../../config/env";

export const makeDbAuthentication = (): Authentication => {
    const salt = 12;
    const bcryptAdapter = new BcryptAdapter(salt);
    const jwtAdapter = new JwtAdapter(env.jwtSecret);
    const accountMongoRepository = new AccountMongoRepository();
    return new DbAuthentication(accountMongoRepository, bcryptAdapter, jwtAdapter, accountMongoRepository);
};
