import { Router } from "express";
import { ThaiAddressControllers } from "../controllers/ThaiAddress.Controllers";

export const thaiAddressRouter = (
  controllers: ThaiAddressControllers
): Router => {
  const router = Router();

  router.get("/provinces", (req, res) => {
    controllers.findAllProvinces.handle(req, res);
  });

  router.get("/districts/:id", (req, res) => {
    controllers.findDistsByProvince.handle(req, res);
  });

  router.get("/sub-districts/:id", (req, res) => {
    controllers.findSubDistsByDistrict.handle(req, res);
  });

  return router;
};
