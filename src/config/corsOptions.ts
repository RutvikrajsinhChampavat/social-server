import { CorsOptions, CorsOptionsDelegate } from "cors";
import { whiteList } from "./allowedOrigins";

export const corsOption: CorsOptions | CorsOptionsDelegate = {
  origin: (origin, callback) => {
    if (!origin || whiteList?.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error("Not allowed by CORS"));
  },
  optionsSuccessStatus: 200,
};
