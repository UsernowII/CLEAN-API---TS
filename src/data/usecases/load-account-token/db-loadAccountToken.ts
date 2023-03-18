import { LoadAccountByToken } from "../../../domain/usecases/loadAccountByToken";
import { Decrypter } from "../../protocols/criptography/decrypter";
import { AccountModel } from "../add-account/db-add-account-protocols";

export class DbLoadAccountToken implements LoadAccountByToken {
    constructor (private readonly decrypter: Decrypter) {}

    async load (accessToken: string, role?: string): Promise<AccountModel> {
        await this.decrypter.decrypt(accessToken);
        return null;
    }
}
