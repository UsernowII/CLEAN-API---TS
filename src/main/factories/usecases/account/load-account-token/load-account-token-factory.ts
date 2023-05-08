import { LoadAccountByToken } from "../../../../../domain/usecases/loadAccountByToken";
import { DbLoadAccountToken } from "../../../../../data/usecases/load-account-token/db-loadAccountToken";
import { AccountMongoRepository } from "../../../../../infra/db/mongodb/account-repository/accountMongoRepository";
import { JwtAdapter } from "../../../../../infra/criptography/jwt-adapter/jwtAdapter";
import env from "../../../../config/env";

export const makeDbLoadAccountToken = (): LoadAccountByToken => {
    const jwtAdapter = new JwtAdapter(env.jwtSecret);
    const accountMongoRepo = new AccountMongoRepository();
    return new DbLoadAccountToken(jwtAdapter, accountMongoRepo);
};
