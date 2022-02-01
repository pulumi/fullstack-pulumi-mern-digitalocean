import express, { Request, Response } from "express";
export const itemsRouter = express.Router();

import { getItems, addItem, updateItem, deleteItem } from "./item";

itemsRouter.get("/", async (req: Request, res: Response) => {
    try {
        const items = await getItems();
        res.status(200).send(items);
    } catch (e: any) {
        console.error(e.message);
        res.status(500).send(e.message);
    }
});

itemsRouter.post("/", async (req: Request, res: Response) => {
    try {
        const result = await addItem(req.body.name);
        res.status(201).send({ id: result.insertedid});
    } catch (e: any) {
        console.error(e.message);
        res.status(500).send(e.message);
    }
});

itemsRouter.put("/:id", async (req: Request, res: Response) => {
    try {
        await updateItem(req.params.id, req.body.done);
        res.status(201).send();
    } catch (e: any) {
        console.error(e.message);
        res.status(500).send(e.message);
    }
});

itemsRouter.delete("/:id", async (req: Request, res: Response) => {
    try {
        await deleteItem(req.params.id, req.body.done);
        res.status(204).send();
    } catch (e: any) {
        console.error(e.message);
        res.status(500).send(e.message);
    }
});
