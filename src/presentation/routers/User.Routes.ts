import { Router } from "express";
import { UserControllers } from "../controllers/User.Controllers";

export const userRouter = (controllers: UserControllers): Router => {
  const router = Router();

  router.get("/role", (req, res) => {
    controllers.getRole.handle(req, res);
  });

  return router;
};
