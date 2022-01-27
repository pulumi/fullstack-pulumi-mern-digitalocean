import * as pulumi from "@pulumi/pulumi";
import * as digitalocean from "@pulumi/digitalocean";

const region = digitalocean.Region.SFO3;

// This will create a publicly accessible cluster, and it takes a while. But .. neat!
// Also, to connect from your local machine, you'll need to download a cert from the dashboard.
// https://docs.digitalocean.com/products/databases/mongodb/how-to/connect/#connect-to-the-database
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

// https://docs.digitalocean.com/products/app-platform/references/app-specification-reference/
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
                        key: "DB_CONNECTION_STRING",
                        scope: "RUN_AND_BUILD_TIME",
                        value: pulumi.interpolate`mongodb+srv://${cluster.user}:${cluster.password}@${cluster.host}/${cluster.database}`,
                        type: "SECRET",
                    },
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

export const { host, port, user, password, database } = cluster;
export const { name } = db;
export const { liveUrl } = app;

// mongosh --tls --tlsCAFile ~/Downloads/ca-certificate.crt "mongodb+srv://$(pulumi stack output user):$(pulumi stack output password --show-secrets)@$(pulumi stack output host)/$(pulumi stack output database)"
