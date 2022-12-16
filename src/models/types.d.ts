import { Request } from "express";

interface USER {
  id: number;
  username: string;
  password: string;
  refreshToken?: string;
  roles: { "user": number; "admin"?: number };
}

interface ROLE {
  "user": number;
  "admin"?: number;
}

interface CustomRequest extends Request {
  username?: string;
  roles?: Array<number>;
}
