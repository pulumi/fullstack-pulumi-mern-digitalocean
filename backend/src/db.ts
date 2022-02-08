import * as path from "path";
import * as fs from "fs";
import * as mongodb from "mongodb";
import * as bson from "bson";

const conn = process.env.DATABASE_URL || "mongodb://127.0.0.1";
if (!conn) {
    process.exit(1);
}

let caCertificatePath: string | undefined;
if (process.env.CA_CERT) {
    caCertificatePath = path.resolve("./ca-certificate.crt")
    fs.writeFileSync(caCertificatePath, process.env.CA_CERT);
}

export const client = new mongodb.MongoClient(conn, {
    sslCA: caCertificatePath,
});

export const findByID = (id: string) => ({ _id: new bson.ObjectID(id) });
