import { Router } from "express";
import { RestaurantControllers } from "../controllers/Restaurant.Controllers";
import {
  authorizeOwnerAction,
  authorizeRolesAction,
  checkLogout,
  checkRequestToken,
} from "../../shared/middlewares/authorization";
import { TokenRole } from "../../shared/enum/TokenRole";
import { sendErrorResponse } from "../../shared/sendErrorResponse";

export const restaurantRouter = (
  controllers: RestaurantControllers
): Router => {
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
    authorizeOwnerAction([TokenRole.RESTAURANT]),
    (req, res) => {
      controllers.update.handle(req, res);
    }
  );

  router.delete(
    "/",
    checkRequestToken,
    authorizeOwnerAction([TokenRole.RESTAURANT]),
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
