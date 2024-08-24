import { Request } from "express";

export const isRequestBodyEmpty = (req: Request) =>
  Object.keys(req.body).length === 0;
