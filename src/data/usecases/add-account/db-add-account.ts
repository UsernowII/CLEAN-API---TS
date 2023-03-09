import {
    AccountModel, AddAccountModel,
    Hasher, AddAccount, AddAccountRepository,
    LoadAccountByEmailRepository
} from "./db-add-account-protocols";

export class DbAddAccount implements AddAccount {
    constructor (
        private readonly hasher: Hasher,
        private readonly addAccountRepository: AddAccountRepository,
        private readonly loadAccountByEmailRepo: LoadAccountByEmailRepository
    ) { }

    async add (accountData: AddAccountModel): Promise<AccountModel> {
        await this.loadAccountByEmailRepo.loadByEmail(accountData.email);
        const hashedPassword = await this.hasher.hash(accountData.password);
        return await this.addAccountRepository.add(Object.assign({}, accountData, { password: hashedPassword }));
    };
}
