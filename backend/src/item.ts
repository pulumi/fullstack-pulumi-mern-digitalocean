import { client, findByID } from "./db";

export interface Item {
    _id: string;
    name: string;
    done: boolean;
}

const dbName = "grocery-list";
const collectionName = "items";

export const getItems = async (): Promise<any[]> => {
    const connection = await client.connect();
    return connection.db(dbName).collection(collectionName)
        .find()
        .toArray();
};

export const addItem = async(name: string): Promise<any> => {
    const connection = await client.connect();
    return connection.db(dbName).collection(collectionName)
        .insertOne({ name, done: false });
};

export const updateItem = async(id: string, done: boolean): Promise<any> => {
    const connection = await client.connect();
    return connection.db(dbName).collection(collectionName)
        .findOneAndUpdate(findByID(id), { $set: { done: done }}, { upsert: true });
};

export const deleteItem = async(id: string, done: boolean): Promise<any> => {
    const connection = await client.connect();
    return connection.db(dbName).collection(collectionName)
        .findOneAndDelete(findByID(id));
};
