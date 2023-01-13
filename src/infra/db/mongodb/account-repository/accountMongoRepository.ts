import { AddAccountRepository } from "../../../../data/protocols/db/addAccountRepository";
import { AccountModel } from "../../../../domain/models/account";
import { AddAccountModel } from "../../../../domain/usecases/addAccount";
import { MongoHelper } from "../helpers/mongo-helper";

export class AccountMongoRepository implements AddAccountRepository {
    async add (account: AddAccountModel): Promise < AccountModel > {
        const accountCollection = await MongoHelper.getCollection("accounts");
        const { insertedId } = await accountCollection.insertOne(account);
        return MongoHelper.mapper(account, insertedId);
    };
}
