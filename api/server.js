"use strict";

const express = require("express");
const mongodb = require("mongodb");

const PORT = 8080;
const HOST = '0.0.0.0';

const app = express();
app.get('/', (req, res) => {
    res.send("Hello World");
});

app.get("/test", (req, res) => {
    res.send(process.env.DB_CONNECTION_STRING);
})

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
