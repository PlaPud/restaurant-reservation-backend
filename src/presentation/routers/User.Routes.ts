import { Router } from "express";
import { UserControllers } from "../controllers/User.Controllers";

export const userRouter = (controllers: UserControllers): Router => {
  const router = Router();

  router.get("/data", (req, res) => {
    controllers.getData.handle(req, res);
  });

  return router;
};
