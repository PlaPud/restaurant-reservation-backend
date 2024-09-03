import { Router } from "express";
import { checkLogout } from "../../shared/middlewares/authorization";
import { AdminControllers } from "../controllers/Admin.Controllers";

export const adminRouter = (controllers: AdminControllers) => {
  const router = Router();

  router.post("/login", checkLogout, (req, res) => {
    controllers.login.handle(req, res);
  });

  return router;
};
