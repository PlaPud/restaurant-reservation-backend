import { Router } from "express";
import { ReservationControllers } from "../controllers/Reservation.Controllers";

export const reservationRouter = (
  controllers: ReservationControllers
): Router => {
  const router = Router();

  router.post("/", (req, res) => {
    controllers.create.handle(req, res);
  });

  router.get("/", (req, res) => {
    if (req.query.reserveId) {
      controllers.get.handle(req, res);
      return;
    }
    controllers.getAll.handle(req, res);
  });

  router.get("/avail", (req, res) => {
    controllers.getAvail.handle(req, res);
  });

  router.get("/booked", (req, res) => {
    controllers.getBooked.handle(req, res);
  });

  router.get("/attend", (req, res) => {
    controllers.getAttend.handle(req, res);
  });

  router.put("/", (req, res) => {
    controllers.update.handle(req, res);
  });

  router.patch("/pay-url", (req, res) => {
    controllers.updatePayUrl.handle(req, res);
  });

  router.patch("/payed", (req, res) => {
    controllers.updatePayed.handle(req, res);
  });

  router.patch("/attend", (req, res) => {
    controllers.updateAttend.handle(req, res);
  });

  router.delete("/", (req, res) => {
    controllers.delete.handle(req, res);
  });

  router.delete("/all", (req, res) => {
    controllers.deleteAll.handle(req, res);
  });

  return router;
};
