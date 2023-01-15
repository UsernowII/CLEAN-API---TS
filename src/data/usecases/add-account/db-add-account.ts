import { AccountModel, AddAccountModel, Hasher, AddAccount, AddAccountRepository } from "./db-add-account-protocols";

export class DbAddAccount implements AddAccount {
    constructor (
        private readonly hasher: Hasher,
        private readonly addAccountRepository: AddAccountRepository
    ) { }

    async add (accountData: AddAccountModel): Promise<AccountModel> {
        const hashedPassword = await this.hasher.hash(accountData.password);
        return await this.addAccountRepository.add(Object.assign({}, accountData, { password: hashedPassword }));
    };
}
