import express, { Request, Response } from "express";
export const itemsRouter = express.Router();

import { findAllTasks, addTask } from "./task";

itemsRouter.get("/", async (req: Request, res: Response) => {
    try {
        const items = await findAllTasks();
        res.status(200).send(items);
    } catch (e: any) {
        console.error(e.message);
        res.status(500).send(e.message);
    }
});

itemsRouter.post("/", async (req: Request, res: Response) => {
     try {
        const result = await addTask(req.body.name);
        res.status(201).send({ id: result.insertedid});
    } catch (e: any) {
        console.error(e.message);
        res.status(500).send(e.message);
    }
});
