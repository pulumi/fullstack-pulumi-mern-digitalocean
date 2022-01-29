import * as path from "path";
import * as fs from "fs";
import * as mongodb from "mongodb";

let sslCA: string | undefined;

if (process.env.CA_CERT) {
    sslCA = path.resolve("./ca-certificate.crt")
    fs.writeFileSync(sslCA, process.env.CA_CERT);
}

const conn = process.env.DATABASE_URL || undefined;
if (!conn) {
    process.exit(1);
}

export const client = new mongodb.MongoClient(conn, {
    sslCA,
});
