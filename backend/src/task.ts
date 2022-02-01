import { client, findByID } from "./db";

export interface Task {
    id: string;
    name: string;
    created: Date;
    done: boolean;
}

export const findAllTasks = async (): Promise<any[]> => {
    const connection = await client.connect();
    return connection.db("my-app").collection("things")
        .find()
        .toArray();
};

export const addTask = async(name: string): Promise<any> => {
    const connection = await client.connect();
    return connection.db("my-app").collection("things")
        .insertOne({ name, done: false });
};

export const updateTask = async(id: string, done: boolean): Promise<any> => {
    const connection = await client.connect();
    return connection.db("my-app").collection("things")
        .findOneAndUpdate(findByID(id), { $set: { done: done }}, { upsert: true });
};

export const deleteTask = async(id: string, done: boolean): Promise<any> => {
    const connection = await client.connect();
    return connection.db("my-app").collection("things")
        .findOneAndDelete(findByID(id));
};
