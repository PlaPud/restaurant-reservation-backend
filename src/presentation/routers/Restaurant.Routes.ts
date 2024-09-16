import { Router } from "express";
import { RestaurantControllers } from "../controllers/Restaurant.Controllers";
import {
  authorizeReqFromOwner,
  authorizeReqFromRoles,
  checkLogout,
  checkRequestToken,
} from "../../shared/middlewares/authorization";
import { TokenRole } from "../../shared/enum/TokenRole";
import { sendErrorResponse } from "../../shared/sendErrorResponse";
import { uploadFile } from "../../shared/middlewares/multer";

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
    authorizeReqFromOwner([TokenRole.RESTAURANT]),
    (req, res) => {
      controllers.update.handle(req, res);
    }
  );

  router.patch(
    "/profile-img",
    checkRequestToken,
    authorizeReqFromOwner([TokenRole.ADMIN]),
    uploadFile.single("file"),
    (req, res) => {
      controllers.updateProfImg.handle(req, res);
    }
  );

  router.delete(
    "/",
    checkRequestToken,
    authorizeReqFromOwner([TokenRole.RESTAURANT]),
    (req, res) => {
      controllers.delete.handle(req, res);
    }
  );

  router.delete(
    "/all",
    checkRequestToken,
    authorizeReqFromRoles([TokenRole.ADMIN]),
    (req, res) => {
      controllers.deleteAll.handle(req, res);
    }
  );

  router.delete(
    "/profile-img",
    checkRequestToken,
    authorizeReqFromOwner([TokenRole.RESTAURANT]),
    (req, res) => {
      controllers.deleteProfImg.handle(req, res);
    }
  );

  return router;
};
