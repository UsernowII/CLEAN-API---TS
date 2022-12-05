import { Collection, MongoClient, ObjectId } from "mongodb";

export const MongoHelper = {
    client: null as MongoClient,

    async connect (uri: string): Promise<void> {
        this.client = await MongoClient.connect(process.env.MONGO_URL);
    },

    async disconnect (): Promise<void> {
        await this.client.close();
    },

    getCollection (name: string): Collection {
        return this.client.db().collection(name);
    },

    mapper (collection: any, insertedId: ObjectId): any {
        const idMongo = insertedId.toString();
        return Object.assign({}, collection, { id: idMongo });
    }
};
