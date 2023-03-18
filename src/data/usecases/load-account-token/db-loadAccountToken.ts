import { LoadAccountByToken } from "../../../domain/usecases/loadAccountByToken";
import { Decrypter } from "../../protocols/criptography/decrypter";
import { LoadAccountByTokenRepository } from "../../protocols/db/account/loadAccountByTokenRepository";
import { AccountModel } from "../add-account/db-add-account-protocols";

export class DbLoadAccountToken implements LoadAccountByToken {
    constructor (
      private readonly decrypter: Decrypter,
      private readonly loadByTokenRepo: LoadAccountByTokenRepository
    ) {}

    async load (accessToken: string, role?: string): Promise<AccountModel> {
        const token = await this.decrypter.decrypt(accessToken);
        if (accessToken) {
            await this.loadByTokenRepo.loadByToken(token, role);
        }
        return null;
    }
}
