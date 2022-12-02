import { AccountModel, AddAccountModel, Encrypter, AddAccount } from "./db-add-account-protocols";

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
