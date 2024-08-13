import { Router } from "express";
import { RestaurantControllers } from "../controllers/Restaurant.Controllers";

export const restaurantRouter = (
  controllers: RestaurantControllers
): Router => {
  const router = Router();

  router.get("/", (req, res) => {
    if (req.query.restaurantId) {
      controllers.get.handle(req, res);
      return;
    }
    controllers.getAll.handle(req, res);
  });

  router.post("/", (req, res) => {
    controllers.create.handle(req, res);
  });

  router.put("/", (req, res) => {
    controllers.update.handle(req, res);
  });

  router.delete("/", (req, res) => {
    controllers.delete.handle(req, res);
  });

  router.delete("/all", (req, res) => {
    controllers.deleteAll.handle(req, res);
  });

  return router;
};
