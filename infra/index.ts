import * as pulumi from "@pulumi/pulumi";
import * as digitalocean from "@pulumi/digitalocean";

const fetch = require("node-fetch");
const region = digitalocean.Region.SFO3;

const cluster = new digitalocean.DatabaseCluster("mongodb-example", {
    engine: "mongodb",
    version: "4",
    region,
    size: digitalocean.DatabaseSlug.DB_1VPCU1GB,
    nodeCount: 1,
});

const db = new digitalocean.DatabaseDb("db", {
    clusterId: cluster.id,
});

const app = new digitalocean.App("my-whole-entire-app", {
    spec: {
        name: "my-super-sweet-fullstack-app",
        region: region,
        services: [
            {
                name: "api",
                github: {
                    repo: "cnunciato/mern-on-do-test",
                    branch: "main",
                    deployOnPush: true,
                },
                sourceDir: "/api",
                routes: [
                    {
                        path: "/api",
                    },
                ],
                instanceSizeSlug: "basic-xxs",
                httpPort: 8080,
                buildCommand: "npm install",
                runCommand: "npm start",
                instanceCount: 1,
                envs: [
                    {
                        key: "CA_CERT",
                        scope: "RUN_AND_BUILD_TIME",
                        value: "${db.CA_CERT}",
                    },
                    {
                        key: "DATABASE_URL",
                        scope: "RUN_AND_BUILD_TIME",
                        value: "${db.DATABASE_URL}",
                    }
                ],
            },
        ],
        staticSites: [
            {
                name: "frontend",
                github: {
                    repo: "cnunciato/mern-on-do-test",
                    branch: "main",
                    deployOnPush: true,
                },
                sourceDir: "/frontend",
                buildCommand: "npm install && npm run build",
                outputDir: "/build",
            }
        ],
    },
});

// This feels super gross to have to do this, but.
pulumi.all([app.id, app.spec, cluster.name, cluster.engine]).apply(async ([ appID, appSpec, clusterName, clusterEngine]) => {

    const newApp = await fetch(`https://api.digitalocean.com/v2/apps/${appID}`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${process.env.DIGITALOCEAN_TOKEN}`,
            "Accept": "application/json",
        },
    });

    const newAppResult = await newApp.json();
    const newAppSpec = await newAppResult.app.spec;

    newAppSpec.databases = [
        {
            name: "db",
            clusterName,
            engine: clusterEngine.toUpperCase(),
            production: true,
        }
    ];

    const result = await fetch(`https://api.digitalocean.com/v2/apps/${appID}`, {
        method: "PUT",
        body: JSON.stringify({ spec: newAppSpec }),
        headers: {
            "Authorization": `Bearer ${process.env.DIGITALOCEAN_TOKEN}`,
            "Content-Type": "application/json",
        },
    });
});

const trust = new digitalocean.DatabaseFirewall("firewall", {
    clusterId: cluster.id,
    rules: [
        {
            type: "app",
            value: app.id,
        },
    ],
});

export const { host, port, user, password, database } = cluster;
export const { name } = db;
export const { liveUrl } = app;
