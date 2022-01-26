import * as pulumi from "@pulumi/pulumi";
import * as digitalocean from "@pulumi/digitalocean";
import * as docker from "@pulumi/docker";

const region = digitalocean.Region.SFO3;

// https://docs.digitalocean.com/products/app-platform/references/app-specification-reference/
const app = new digitalocean.App("my-whole-entire-app", {
    spec: {
        name: "my-super-sweet-fullstack-app",
        region: region,
        staticSites: [
            {
                name: "frontend",
                github: {
                    repo: "cnunciato/mern-on-do-test",
                    branch: "main",
                },
                sourceDir: "/frontend",
                buildCommand: "npm install && npm run build",
                outputDir: "/build",
            }
        ],
        services: [
            {
                name: "api",
                github: {
                    repo: "cnunciato/mern-on-do-test",
                    branch: "main",
                },
                sourceDir: "/api",
                routes: [
                    {
                        path: "/api",
                    },
                ],
                httpPort: 8080,
                buildCommand: "npm install",
                runCommand: "npm start",
                // cors: {
                //     allowOrigins
                // }
            },
        ],
        // databases: [

        // ]
    },
});

export const { liveUrl } = app;
















// import * as pulumi from "@pulumi/pulumi";
// import * as digitalocean from "@pulumi/digitalocean";

// To use Spaces, you need to create access keys.
// Add this to the Registry docs for DO. It's in the README.
// https://github.com/pulumi/pulumi-digitalocean#configuration

// const region = digitalocean.Region.SFO3;

// This will create a publicly accessible cluster, and it takes a while. But .. neat!
// Also, to connect from your local machine, you'll need to download a cert from the dashboard.
// https://docs.digitalocean.com/products/databases/mongodb/how-to/connect/#connect-to-the-database
// const db = new digitalocean.DatabaseCluster("mongodb-example", {
//     engine: "mongodb",
//     nodeCount: 1,
//     region,
//     size: digitalocean.DatabaseSlug.DB_1VPCU1GB,
//     version: "4",
// });

// const bucket = new digitalocean.SpacesBucket("bucket", {
//     region: digitalocean.Region.SFO3,
//     forceDestroy: true,
// });

// const home = new digitalocean.SpacesBucketObject("index.html", {
//     bucket: bucket.id,
//     acl: "public-read",
//     region,
//     key: "index.html",
//     content: `<html>
//         <h1>Hey!</h1>
//     <html>`,
//     contentType: "text/html",
// });

// export const { host, port, user, password, database } = db;
// export const url = pulumi.interpolate`https://${bucket.id}.${region}.digitaloceanspaces.com/index.html`

// const registry = new digitalocean.ContainerRegistry("registry", {
//     subscriptionTierSlug: "starter",
// });

// const app = new digitalocean.App("app", {
//     spec:
// })

// mongosh --tls --tlsCAFile ~/Downloads/ca-certificate.crt \
//     "mongodb+srv://$(pulumi stack output user):$(pulumi stack output password --show-secrets)@$(pulumi stack output host)/$(pulumi stack output database)" \
