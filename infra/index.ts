import * as pulumi from "@pulumi/pulumi";
import * as digitalocean from "@pulumi/digitalocean";

const fetch = require("node-fetch");

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

// Maybe I need to attach the DB to the app somehow now? How do I do that?

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
                    {
                        key: "CA_CERT",
                        scope: "RUN_AND_BUILD_TIME",
                        value: pulumi.interpolate`\${${cluster.name}.CA_CERT}`,
                    },
                    {
                        key: "DATABASE_URL",
                        scope: "RUN_AND_BUILD_TIME",
                        value: pulumi.interpolate`\${${cluster.name}.DATABASE_URL}`,
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

    // Now overwrite the databases bit so we can update it manually.
    // const newSpec = Object.assign({}, appSpec);

    // const result = await fetch("https://api.digitalocean.com/v2/apps", {
    //     headers: {
    //         "Authorization": `Bearer ${process.env.DIGITALOCEAN_TOKEN}`,
    //         "Content-Type": "application/json",
    //     },
    // });

    const newApp = await fetch(`https://api.digitalocean.com/v2/apps/${appID}`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${process.env.DIGITALOCEAN_TOKEN}`,
            "Accept": "application/json",
        },
    });

    const newAppResult = await newApp.json();

    const newAppSpec = await newAppResult.app.spec;

    console.log({ newAppSpec });

    newAppSpec.databases = [
        {
            name: "db",
            clusterName,
            engine: clusterEngine.toUpperCase(),
            // version: 4,
            production: true,
        }
    ];

    console.log({ newAppSpec });

    const result = await fetch(`https://api.digitalocean.com/v2/apps/${appID}`, {
        method: "PUT",
        body: JSON.stringify({ spec: newAppSpec }),
        headers: {
            "Authorization": `Bearer ${process.env.DIGITALOCEAN_TOKEN}`,
            "Content-Type": "application/json",
        },
    });

    console.log(await result.json());
});

// - cluster_name: mongodb-example-19ef379
//   engine: MONGODB
//   name: mongodb-example-19ef379
//   production: true
//   version: "4"

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

// mongosh --tls --tlsCAFile ~/Downloads/ca-certificate.crt "mongodb+srv://$(pulumi stack output user):$(pulumi stack output password --show-secrets)@$(pulumi stack output host)/$(pulumi stack output database)"
