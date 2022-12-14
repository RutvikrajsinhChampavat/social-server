import { Request, Response } from "express";

const data = {
  "id": 1,
  "message": "Get all data",
};

export const getAllTest = (_req: Request, res: Response) => {
  res.status(200).json({ "message": "Got all data", "data": data });
};

export const addTest = (req: Request, res: Response) => {
  // get data from req.body
  res.status(200).json({ "message": "Test added successfully" });
};

export const updateTest = (_req: Request, res: Response) => {
  res.status(200).json({ "message": "Test updated successfully" });
};

export const deleteTest = (_req: Request, res: Response) => {
  res.status(200).json({ "message": "Test deleted successfully" });
};

export const getTest = (req: Request, res: Response) => {
  res
    .status(200)
    .json({ "message": "test success", "id": req?.params?.id || 1 });
};
