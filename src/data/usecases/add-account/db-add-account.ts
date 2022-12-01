import { AccountModel } from "../../../domain/models/account";
import { AddAccount, AddAccountModel } from "../../../domain/usecases/addAccount";
import { Encrypter } from "../../protocols/encrypter";

export class DbAddAccount implements AddAccount {
    constructor (private readonly encrypter: Encrypter) {}

    async add (account: AddAccountModel): Promise<AccountModel> {
        await this.encrypter.encrypt(account.password);
        return await Promise.resolve({
            id: "valid_id",
            email: "valid_email@email.com",
            name: "valid_name",
            password: "valid_password"
        });
    };
}
