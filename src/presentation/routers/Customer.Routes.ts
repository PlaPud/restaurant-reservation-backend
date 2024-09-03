import { Router } from "express";
import { CustomerControllers } from "../controllers/Customer.Controllers";
import {
  authorizeOwnerAction,
  authorizeRolesAction,
  checkLogout,
  checkRequestToken,
} from "../../shared/middlewares/authorization";
import { TokenRole } from "../../shared/enum/TokenRole";

export const customerRouter = (controllers: CustomerControllers): Router => {
  const router = Router();

  router.get("/", checkRequestToken, (req, res) => {
    controllers.get.handle(req, res);
  });

  router.get("/all", checkRequestToken, (req, res) => {
    controllers.getAll.handle(req, res);
  });

  router.post("/", checkLogout, (req, res) => {
    controllers.create.handle(req, res);
  });

  router.post("/login", checkLogout, (req, res) => {
    controllers.login.handle(req, res);
  });

  router.put(
    "/",
    checkRequestToken,
    authorizeOwnerAction([TokenRole.CUSTOMER]),
    (req, res) => {
      controllers.update.handle(req, res);
    }
  );

  router.delete(
    "/",
    checkRequestToken,
    authorizeOwnerAction([TokenRole.CUSTOMER]),
    (req, res) => {
      controllers.delete.handle(req, res);
    }
  );

  router.delete(
    "/all",
    checkRequestToken,
    authorizeRolesAction([TokenRole.ADMIN]),
    (req, res) => {
      controllers.deleteAll.handle(req, res);
    }
  );

  return router;
};
