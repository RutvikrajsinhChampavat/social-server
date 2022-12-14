import { Request, Response, NextFunction } from "express";

export const error500 = (
  err: any,
  _: Request,
  res: Response,
  next: NextFunction
) => {
  if (err) {
    res.status(500).json({ "message": err.message });
  } else {
    next();
  }
};
