import { MongoHelper as sut } from '../../../../../src/infra/db/mongodb/helpers/mongo-helper';

describe('Mongo Helper', () => {

	beforeAll( async () => {
		await sut.connect(process.env.MONGO_URL as string);
	});

	afterAll( async () => {
		await sut.disconnect();
	});

	test('Should reconnect if mongodb is down', async () => {
		let accountCollection = await sut.getCollection("accounts");
		expect(accountCollection).toBeTruthy();
		await sut.disconnect();
		accountCollection = await sut.getCollection("accounts");
		expect(accountCollection).toBeTruthy();
	});
});
