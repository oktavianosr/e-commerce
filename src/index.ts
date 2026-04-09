import express, { type Express, type Request, type Response } from "express";
import { PORT } from "./secrets.js";
import rootRouter from "./routes/index.js";
import { PrismaClient } from "./generated/prisma/index.js";

const app: Express = express();

app.use(express.json());

app.use("/api", rootRouter);

export const prismaClient = new PrismaClient({
  log: ["query"],
});

app.listen(PORT, () => {
  console.log("App Working!");
});
