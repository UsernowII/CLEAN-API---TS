import { AddAccountRepository } from "../../../data/protocols/addAccountRepository";
import { AccountModel } from "../../../domain/models/account";
import { AddAccountModel } from "../../../domain/usecases/addAccount";
import { MongoHelper } from "./mongo-helpers";

export class AccountMongoRepository implements AddAccountRepository {
    async add (account: AddAccountModel): Promise < AccountModel > {
        const accountCollection = MongoHelper.getCollection("accounts");
        const insertResult = await accountCollection.insertOne(account);
        const idMongo = insertResult.insertedId.toString();
        return Object.assign({}, account, { id: idMongo }); ;
    };
}
