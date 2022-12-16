import { Response, NextFunction } from "express";
import { CustomRequest } from "../models/types";

export const verifyRoles = (...allowedRoles: number[]) => {
  return (req: CustomRequest, res: Response, next: NextFunction) => {
    if (!req?.roles) return res.sendStatus(401);

    const rolesArr = [...allowedRoles];

    const result = req.roles
      ?.map((role: number) => rolesArr?.includes(role))
      .find((value: boolean) => value === true);

    if (!result) return res.sendStatus(401);
    next();
  };
};
