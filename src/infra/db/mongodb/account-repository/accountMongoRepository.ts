import { AddAccountRepository } from "../../../../data/protocols/db/addAccountRepository";
import { AccountModel } from "../../../../domain/models/account";
import { AddAccountModel } from "../../../../domain/usecases/addAccount";
import { MongoHelper } from "../helpers/mongo-helper";
import { LoadAccountByEmailRepository } from "../../../../data/protocols/db/loadAccountByEmailRepository";

export class AccountMongoRepository implements AddAccountRepository, LoadAccountByEmailRepository {
    async add (account: AddAccountModel): Promise <AccountModel> {
        const accountCollection = await MongoHelper.getCollection("accounts");
        const { insertedId } = await accountCollection.insertOne(account);
        return MongoHelper.mapper(account, insertedId);
    };

    async loadByEmail (email: string): Promise<AccountModel> {
        const accountCollection = await MongoHelper.getCollection("accounts");
        const idAccount = (await accountCollection.findOne({ email }));
        const account = {
            email,
            name: "any_name",
            password: "any_password"
        };
        return idAccount && MongoHelper.mapper(account, idAccount._id);
    }
}
