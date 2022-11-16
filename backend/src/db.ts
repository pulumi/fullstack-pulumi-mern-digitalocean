import * as mongodb from "mongodb";
import * as bson from "bson";

const conn = process.env.DATABASE_URL || "mongodb://127.0.0.1";
export const client = new mongodb.MongoClient(conn);

export const findByID = (id: string) => ({ _id: new bson.ObjectID(id) });
