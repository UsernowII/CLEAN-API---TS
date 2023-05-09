import { ObjectId } from "mongodb";
import { MongoHelper } from "../helpers/mongo-helper";
import { AddAccountRepository } from "../../../../data/protocols/db/account/addAccountRepository";
import { AddAccountModel, AccountModel } from "../../../../data/usecases/add-account/db-add-account-protocols";
import { LoadAccountByEmailRepository } from "../../../../data/protocols/db/account/loadAccountByEmailRepository";
import { UpdateAccessTokenRepository } from "../../../../data/protocols/db/account/updateAccessTokenRepository";
import { LoadAccountByTokenRepository } from "../../../../data/protocols/db/account/loadAccountByTokenRepository";

export class AccountMongoRepository implements
AddAccountRepository, LoadAccountByEmailRepository,
UpdateAccessTokenRepository, LoadAccountByTokenRepository {
    async add (account: AddAccountModel): Promise <AccountModel> {
        const accountCollection = await MongoHelper.getCollection("accounts");
        const { insertedId } = await accountCollection.insertOne(account);
        return MongoHelper.mapper(account, insertedId);
    };

    async loadByEmail (email: string): Promise<AccountModel> {
        const accountCollection = await MongoHelper.getCollection("accounts");
        const account = await accountCollection.findOne({
            email
        }, {
            projection: {
                _id: 1,
                name: 1,
                password: 1,
                email: 1
            }
        });
        return account && MongoHelper.mapper(account, account._id);
    }

    async updateAccessToken (id: string, token: string): Promise<void> {
        const accountCollection = await MongoHelper.getCollection("accounts");
        await accountCollection.updateOne({
            _id: new ObjectId(id)
        }, {
            $set: {
                accessToken: token
            }
        });
    };

    async loadByToken (token: string, role?: string): Promise<AccountModel> {
        const accountCollection = await MongoHelper.getCollection("accounts");
        const account = await accountCollection.findOne(
            {
                accessToken: token,
                $or: [
                    {
                        role
                    },
                    {
                        role: "admin"
                    }
                ]
            },
            {
                projection: {
                    _id: 1,
                    name: 1,
                    password: 1,
                    email: 1
                }
            }
        );
        return account && MongoHelper.mapper(account, account._id);
    };
}
