import * as pulumi from "@pulumi/pulumi";
import * as digitalocean from "@pulumi/digitalocean";

const region = digitalocean.Region.SFO3;

const config = new pulumi.Config();
const repo = config.require("repo");
const branch = config.require("branch");

const cluster = new digitalocean.DatabaseCluster("cluster", {
    engine: "mongodb",
    version: "4",
    region,
    size: digitalocean.DatabaseSlug.DB_1VPCU1GB,
    nodeCount: 1,
});

const db = new digitalocean.DatabaseDb("db", {
    name: "my-app",
    clusterId: cluster.id,
});

const app = new digitalocean.App("app", {
    spec: {
        name: "my-app",
        region: region,
        staticSites: [
            {
                name: "frontend",
                github: {
                    repo,
                    branch,
                    deployOnPush: true,
                },
                sourceDir: "/frontend",
                buildCommand: "npm install && npm run build",
                outputDir: "/dist",
            }
        ],
        services: [
            {
                name: "backend",
                github: {
                    repo,
                    branch,
                    deployOnPush: true,
                },
                sourceDir: "/backend",
                routes: [
                    {
                        path: "/api",
                    },
                ],
                instanceSizeSlug: "basic-xxs",
                httpPort: 8000,
                buildCommand: "npm install && npm run build",
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
        databases: [
            {
                name: "db",
                clusterName: cluster.name,
                engine: cluster.engine.apply(engine => engine.toUpperCase()),
                production: true,
            }
        ]
    },
});

// Add the app as a trusted source.
const trustedSource = new digitalocean.DatabaseFirewall("trusted-source", {
    clusterId: cluster.id,
    rules: [
        {
            type: "app",
            value: app.id,
        },
    ],
});

export const { liveUrl } = app;
