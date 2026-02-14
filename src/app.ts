import express, { Request, Response } from "express";

const app = express();

app.use(express.json());

app.get("/healthCheck", (req: Request, res: Response) => {
  res.send("Manage The Tasks is running...");
});

export default app;
