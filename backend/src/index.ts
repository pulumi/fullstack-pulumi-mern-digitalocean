import express from "express";
import { itemsRouter } from "./routes";

const prefix = process.env.BACKEND_ROUTE_PREFIX || "";
const port = process.env.BACKEND_SERVICE_PORT || 8000;
const app = express();

app.use(express.json());
app.use(`${prefix}/items`, itemsRouter);

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
