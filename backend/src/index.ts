/**
 * Required External Modules
 */


import express from "express";
import { itemsRouter } from "./routes";


/**
 * App Variables
 */

const prefix = process.env.BACKEND_ROUTE_PREFIX || "";
const port = process.env.BACKEND_SERVICE_PORT || 8000;
const app = express();

/**
 *  App Configuration
 */

 app.use(express.json());
 app.use(`${prefix}/tasks`, itemsRouter);

/**
 * Server Activation
 */

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
