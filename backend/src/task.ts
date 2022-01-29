import { client } from "./db";

export interface Task {
    id: string;
    name: string;
    created: Date;
    done: boolean;
}

export const findAllTasks = async (): Promise<any[]> => {
    const connection = await client.connect();
    const collections = connection.db("my-app").collection("things").find().toArray();
    return collections;
};

export const addTask = async(name: string): Promise<any> => {
    const connection = await client.connect();
    return connection.db("my-app").collection("things").insertOne({ name });
};
