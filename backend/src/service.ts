// src/items/items.service.ts

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

const client = new mongodb.MongoClient(conn, {
    sslCA,
});

/**
 * Data Model Interfaces
 */

import { BaseItem, Item } from "./item";
import { Items } from "./items";


/**
 * In-Memory Store
 */

 let items: Items = {
    1: {
        id: 1,
        name: "Burger",
        price: 599,
        description: "Tasty",
        image: "https://cdn.auth0.com/blog/whatabyte/burger-sm.png"
    },
    2: {
        id: 2,
        name: "Pizza",
        price: 299,
        description: "Cheesy",
    image: "https://cdn.auth0.com/blog/whatabyte/pizza-sm.png"
    },
    3: {
        id: 3,
        name: "Tea",
        price: 199,
        description: "Informative",
        image: "https://cdn.auth0.com/blog/whatabyte/tea-sm.png"
    }
};

/**
 * Service Methods
 */

export const findAll = async (): Promise<mongodb.ListDatabasesResult> => {
    await client.connect();
    return client.db().admin().listDatabases();
};

export const find = async (id: number): Promise<Item> => items[id];

export const create = async (newItem: BaseItem): Promise<Item> => {
    const id = new Date().valueOf();

    items[id] = {
        id,
        ...newItem,
    };

    return items[id];
};

export const update = async (
    id: number,
    itemUpdate: BaseItem
): Promise<Item | null> => {
    const item = await find(id);

    if (!item) {
        return null;
    }

    items[id] = { id, ...itemUpdate };

    return items[id];
};

export const remove = async (id: number): Promise<null | void> => {
    const item = await find(id);

    if (!item) {
        return null;
    }

    delete items[id];
};
