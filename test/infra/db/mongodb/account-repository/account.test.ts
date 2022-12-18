import { AccountMongoRepository } from "../../../../../src/infra/db/mongodb/account-repository/accountMongoRepository";
import { MongoHelper } from "../../../../../src/infra/db/mongodb/helpers/mongo-helper";

describe('Account Mongo Repository', () => {

  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  afterEach(async () => {
    await (await MongoHelper.getCollection("accounts")).deleteMany({});
  })

  const makeSut = (): AccountMongoRepository => {
    return new AccountMongoRepository();
  }

  test('Should return an account on success', async () => {
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
});
