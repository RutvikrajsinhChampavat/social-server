import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import path from "path";
import cors from "cors";
import { error500 } from "./middleware/errorHandler";
import testRoute from "./routes/testRoutes";
import { corsOption } from "./config/corsOptions";
import authRoute from "./routes/authRoutes";
import userRoute from "./routes/userRoutes";

dotenv.config();

if (!process.env.PORT) {
  process.exit(1);
}

const PORT: number = parseInt(process.env.PORT, 10) || 8081;

const app: Express = express();

// Cross Origin Resource Sharing
app.use(cors(corsOption));

app.use(express.urlencoded({ extended: true })); // used to get data from URL / form data

app.use(express.json()); //used to get data from JSON type
app.use(express.static(path.join(__dirname, "/public")));

app.use(helmet());

app.use("/test", testRoute);
app.use("/auth", authRoute);
app.use("/users", userRoute);
app.use("*", (_: Request, res: Response) =>
  res.status(404).json({ "message": "Invalid requet URL" })
);

app.get("/api", (_req: Request, res: Response) =>
  res.status(200).json({ message: "success" })
);

app.use(error500);

app.listen(PORT, () =>
  console.log(`Server is up and running on port : ${PORT}`)
);
