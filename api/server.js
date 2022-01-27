"use strict";

const express = require("express");
const mongodb = require("mongodb");
const path = require("path");
const fs = require("fs");

const PORT = 8080;
const HOST = '0.0.0.0';

const app = express();

let sslCA = path.resolve("./ca-certificate.crt");

if (process.env.CA_CERT) {
    fs.writeFileSync(sslCA, process.env.CA_CERT);
}

console.log(process.env);

app.get('/', async (req, res) => {
    const conn = process.env.DB_CONNECTION_STRING;
    // const conn = process.env.DATABASE_URL;
    const client = new mongodb.MongoClient(conn, {
        sslCA,
    });

    await client.connect();
    const dbs = await client.db().admin().listDatabases();

    res.send(JSON.stringify(dbs));
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
