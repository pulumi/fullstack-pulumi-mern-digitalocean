"use strict";

const express = require("express");
const mongodb = require("mongodb");

const PORT = 8080;
const HOST = '0.0.0.0';

const app = express();

app.get('/', async (req, res) => {
    const conn = process.env.DB_CONNECTION_STRING;
    const client = new mongodb.MongoClient(conn);

    await client.connect();
    const dbs = await client.db().admin().listDatabases();
    res.send(JSON.stringify(dbs));
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
