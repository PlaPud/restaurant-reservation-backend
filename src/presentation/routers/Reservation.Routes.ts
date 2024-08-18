import { Router } from "express";
import { ReservationControllers } from "../controllers/Reservation.Controllers";

export const reservationRouter = (
  controllers: ReservationControllers
): Router => {
  const router = Router();

  router.post("/", (req, res) => {
    controllers.create.handle(req, res);
  });

  return router;
};
