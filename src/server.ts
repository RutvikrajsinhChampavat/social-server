import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.PORT) {
  process.exit(1);
}

const PORT: number = parseInt(process.env.PORT, 10);

const app: Express = express();

app.get("/api", (_req: Request, res: Response) =>
  res.json({ status: 404, message: "success" })
);

app.listen(PORT, () =>
  console.log(`Server is up and running on port : ${PORT}`)
);
