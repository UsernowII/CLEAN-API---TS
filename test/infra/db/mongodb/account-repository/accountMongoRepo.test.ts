import { Collection } from "mongodb";
import { AccountMongoRepository } from "../../../../../src/infra/db/mongodb/account-repository/accountMongoRepository";
import { MongoHelper } from "../../../../../src/infra/db/mongodb/helpers/mongo-helper";

let accountCollection: Collection;

describe('Account Mongo Repository', () => {

  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL as string);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection("accounts");
    await accountCollection.deleteMany({});
  })

  const makeSut = (): AccountMongoRepository => {
    return new AccountMongoRepository();
  }

  describe("Add", () => {
    test('Should return an account on add success', async () => {
      const sut = makeSut();
      const account = await sut.add({
        name: "any_name",
        email: "any_email@email.com",
        password: "any_password",
      });
      expect(account).toBeTruthy();
      expect(account.id).not.toBeNull();
      expect(account.name).toBe("any_name");
      expect(account.email).toBe("any_email@email.com");
      expect(account.password).toBe("any_password");
    });
  })

  describe("LoadByEmail", () => {
    test('Should return an account when loadByEmail success', async () => {
      const sut = makeSut();
      await accountCollection.insertOne({
        name: "any_name",
        email: "any_email@email.com",
        password: "any_password",
      })
      const account = await sut.loadByEmail("any_email@email.com");
      expect(account).toBeTruthy();
      expect(account.id).toBeTruthy();
      expect(account.name).toBe("any_name");
      expect(account.email).toBe("any_email@email.com");
      expect(account.password).toBe("any_password");
    });
  
    test('Should return null if loadByEmails fails', async () => {
      const sut = makeSut();
      const account = await sut.loadByEmail("any_email@email.com");
      expect(account).toBeNull();
    });
  })

  describe("UpdateAccessToken", () => {
    test('Should update accessToken when updateAccessToken success', async () => {
      const sut = makeSut();
      const { insertedId } = await accountCollection.insertOne({
        name: "any_name",
        email: "any_email@email.com",
        password: "any_password",
      })
      await sut.updateAccessToken(insertedId.toString(), "any_token");
      const account = await accountCollection.findOne({ _id: insertedId});
      expect(account).toBeTruthy();
      expect(account?.accessToken).toBe("any_token");
    });
  })

  describe("LoadByToken", () => {
    test('Should return an account when loadByToken without role success', async () => {
      const sut = makeSut();
      await accountCollection.insertOne({
        name: "any_name",
        email: "any_email@email.com",
        password: "any_password",
        accessToken: "any_token",
      })
      const account = await sut.loadByToken("any_token");
      expect(account).toBeTruthy();
      expect(account.id).toBeTruthy();
      expect(account.name).toBe("any_name");
      expect(account.email).toBe("any_email@email.com");
      expect(account.password).toBe("any_password");
    });
    test('Should return an account on loadByToken with admin role success', async () => {
      const sut = makeSut();
      await accountCollection.insertOne({
        name: "any_name",
        email: "any_email@email.com",
        password: "any_password",
        accessToken: "any_token",
        role: "admin"
      })
      const account = await sut.loadByToken("any_token", "admin");
      expect(account).toBeTruthy();
      expect(account.id).toBeTruthy();
      expect(account.name).toBe("any_name");
      expect(account.email).toBe("any_email@email.com");
      expect(account.password).toBe("any_password");
    });
    test('Should return null on loadByToken with invalid role', async () => {
      const sut = makeSut();
      await accountCollection.insertOne({
        name: "any_name",
        email: "any_email@email.com",
        password: "any_password",
        accessToken: "any_token",
      })
      const account = await sut.loadByToken("any_token", "admin");
      expect(account).toBeNull();
    });
    test('Should return an account on loadByToken if user is admin', async () => {
      const sut = makeSut();
      await accountCollection.insertOne({
        name: "any_name",
        email: "any_email@email.com",
        password: "any_password",
        accessToken: "any_token",
        role: "admin"
      })
      const account = await sut.loadByToken("any_token");
      expect(account).toBeTruthy();
      expect(account.id).toBeTruthy();
      expect(account.name).toBe("any_name");
      expect(account.email).toBe("any_email@email.com");
      expect(account.password).toBe("any_password");
    });
    test('Should return null if loadByToken fails', async () => {
      const sut = makeSut();
      const account = await sut.loadByToken("any_token");
      expect(account).toBeNull();
    });
  
  })

});
