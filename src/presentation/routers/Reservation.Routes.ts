import { Router } from "express";
import { ReservationControllers } from "../controllers/Reservation.Controllers";
import {
  authorizeOwnerAction,
  authorizeReserveAction,
  authorizeRolesAction,
  checkRequestToken,
} from "../../shared/middlewares/authorization";
import { TokenRole } from "../../shared/enum/TokenRole";
import { ReservationAuthService } from "../../services/ReservationAuthService";

export const reservationRouter = (
  controllers: ReservationControllers,
  authService: ReservationAuthService
): Router => {
  const router = Router();

  router.post(
    "/",
    checkRequestToken,
    authorizeOwnerAction([TokenRole.RESTAURANT]),
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
    authorizeRolesAction([TokenRole.ADMIN]),
    (req, res) => {
      controllers.getAll.handle(req, res);
    }
  );

  // C, R
  router.get(
    "/avail",
    checkRequestToken,
    authorizeRolesAction([TokenRole.CUSTOMER, TokenRole.RESTAURANT]),
    (req, res) => {
      controllers.getAvail.handle(req, res);
    }
  );

  // R
  router.get(
    "/booked",
    checkRequestToken,
    authorizeRolesAction([TokenRole.RESTAURANT]),
    (req, res) => {
      controllers.getBooked.handle(req, res);
    }
  );

  // R
  router.get(
    "/attend",
    checkRequestToken,
    authorizeRolesAction([TokenRole.RESTAURANT]),
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

  router.delete("/all", (req, res) => {
    controllers.deleteAll.handle(req, res);
  });

  return router;
};
