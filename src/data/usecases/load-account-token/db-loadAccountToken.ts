import { LoadAccountByToken } from "../../../domain/usecases/loadAccountByToken";
import { Decrypter } from "../../protocols/criptography/decrypter";
import { LoadAccountByTokenRepository } from "../../protocols/db/account/loadAccountByTokenRepository";
import { AccountModel } from "../../../domain/models/account";

export class DbLoadAccountToken implements LoadAccountByToken {
    constructor (
      private readonly decrypt: Decrypter,
      private readonly loadByTokenRepo: LoadAccountByTokenRepository
    ) {}

    async load (accessToken: string, role?: string): Promise<AccountModel> {
        const token = await this.decrypt.decrypt(accessToken);
        if (token) {
            const account = await this.loadByTokenRepo.loadByToken(accessToken, role);
            console.log({ account });
            return account ?? null;
        }
        return null;
    }
}
