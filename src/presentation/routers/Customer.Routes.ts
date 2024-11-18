import { Router } from "express";
import { CustomerControllers } from "../controllers/Customer.Controllers";
import {
  authorizeReqFromOwner,
  authorizeReqFromRoles,
  checkLogout,
  checkRequestToken,
  useSelfData,
} from "../../shared/middlewares/authorization";
import { TokenRole } from "../../shared/enum/TokenRole";
import { uploadFile } from "../../shared/middlewares/multer";

export const customerRouter = (controllers: CustomerControllers): Router => {
  const router = Router();

  router.get("/", checkRequestToken, (req, res) => {
    controllers.get.handle(req, res);
  });

  router.get(
    "/me",
    checkRequestToken,
    useSelfData([TokenRole.CUSTOMER]),
    authorizeReqFromOwner([TokenRole.CUSTOMER]),
    (req, res) => {
      controllers.get.handle(req, res);
    }
  );

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
    "/me",
    checkRequestToken,
    useSelfData([TokenRole.CUSTOMER]),
    authorizeReqFromOwner([TokenRole.CUSTOMER]),
    (req, res) => {
      controllers.update.handle(req, res);
    }
  );

  router.patch(
    "/profile-img",
    checkRequestToken,
    useSelfData([TokenRole.CUSTOMER]),
    authorizeReqFromOwner([TokenRole.CUSTOMER]),
    uploadFile.single("file"),
    (req, res) => {
      controllers.updateProfImg.handle(req, res);
    }
  );

  router.delete(
    "/me",
    checkRequestToken,
    useSelfData([TokenRole.CUSTOMER]),
    authorizeReqFromOwner([TokenRole.CUSTOMER]),
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
    useSelfData([TokenRole.CUSTOMER]),
    authorizeReqFromOwner([TokenRole.CUSTOMER]),
    (req, res) => {
      controllers.deleteProfImg.handle(req, res);
    }
  );

  return router;
};
