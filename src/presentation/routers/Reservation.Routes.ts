import { Router } from "express";
import { ReservationControllers } from "../controllers/Reservation.Controllers";
import {
  authorizeReqFromOwner,
  authorizeReserveAction,
  authorizeReqFromRoles,
  checkRequestToken,
} from "../../shared/middlewares/authorization";
import { TokenRole } from "../../shared/enum/TokenRole";
import { ReservationAuthService } from "../../services/ReservationAuthService";
import { uploadFile } from "../../shared/middlewares/multer";

export const reservationRouter = (
  controllers: ReservationControllers,
  authService: ReservationAuthService
): Router => {
  const router = Router();

  router.post(
    "/",
    checkRequestToken,
    authorizeReqFromOwner([TokenRole.RESTAURANT]),
    (req, res) => {
      controllers.create.handle(req, res);
    }
  );

  router.get("/", checkRequestToken, (req, res) => {
    controllers.get.handle(req, res);
  });

  router.get(
    "/all",
    checkRequestToken,
    authorizeReqFromRoles([TokenRole.ADMIN]),
    (req, res) => {
      controllers.getAll.handle(req, res);
    }
  );

  // C, R
  router.get(
    "/avail",
    checkRequestToken,
    authorizeReqFromRoles([TokenRole.CUSTOMER, TokenRole.RESTAURANT]),
    (req, res) => {
      controllers.getAvail.handle(req, res);
    }
  );

  // R
  router.get(
    "/booked",
    checkRequestToken,
    authorizeReqFromRoles([TokenRole.RESTAURANT]),
    (req, res) => {
      controllers.getBooked.handle(req, res);
    }
  );

  // R
  router.get(
    "/attend",
    checkRequestToken,
    authorizeReqFromRoles([TokenRole.RESTAURANT]),
    (req, res) => {
      controllers.getAttend.handle(req, res);
    }
  );

  // C R (Query : ReserveId)
  router.put(
    "/",
    checkRequestToken,
    authorizeReserveAction(
      [TokenRole.CUSTOMER, TokenRole.RESTAURANT],
      authService
    ),
    (req, res) => {
      controllers.update.handle(req, res);
    }
  );

  // C (Query : ReserveId)
  router.patch(
    "/pay-url",
    checkRequestToken,
    authorizeReserveAction([TokenRole.CUSTOMER], authService),
    uploadFile.single("file"),
    (req, res) => {
      controllers.updatePayUrl.handle(req, res);
    }
  );

  // R (Query : ReserveId)
  router.patch(
    "/payed",
    checkRequestToken,
    authorizeReserveAction([TokenRole.RESTAURANT], authService),
    (req, res) => {
      controllers.updatePayed.handle(req, res);
    }
  );

  // R (Query : ReserveId)
  router.patch(
    "/attend",
    checkRequestToken,
    authorizeReserveAction([TokenRole.RESTAURANT], authService),
    (req, res) => {
      controllers.updateAttend.handle(req, res);
    }
  );

  // R (Query : ReserveId)
  router.delete(
    "/",
    checkRequestToken,
    authorizeReserveAction([TokenRole.RESTAURANT], authService),
    (req, res) => {
      controllers.delete.handle(req, res);
    }
  );

  router.delete(
    "/pay-url",
    checkRequestToken,
    authorizeReserveAction([TokenRole.CUSTOMER], authService),
    (req, res) => {
      controllers.deletePayUrl.handle(req, res);
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

  return router;
};
