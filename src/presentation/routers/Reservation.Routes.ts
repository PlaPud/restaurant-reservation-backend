import { Router } from "express";
import { ReservationControllers } from "../controllers/Reservation.Controllers";
import {
  authorizeReqFromOwner,
  authorizeReserveAction,
  authorizeReqFromRoles,
  checkRequestToken,
  useSelfData,
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
    useSelfData([TokenRole.RESTAURANT]),
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
    useSelfData([TokenRole.RESTAURANT]),
    authorizeReqFromRoles([TokenRole.RESTAURANT]),
    (req, res) => {
      controllers.getAll.handle(req, res);
    }
  );

  router.get(
    "/avail",
    checkRequestToken,
    useSelfData([TokenRole.RESTAURANT]),

    useSelfData([TokenRole.RESTAURANT, TokenRole.CUSTOMER]),
    (req, res) => {
      controllers.getAvail.handle(req, res);
    }
  );

  // TODO: CREATE NEW API FOR GET PENDING
  router.get(
    "/pending",
    checkRequestToken,
    useSelfData([TokenRole.RESTAURANT]),
    authorizeReqFromRoles([TokenRole.RESTAURANT]),
    (req, res) => {
      controllers.getPending.handle(req, res);
    }
  );

  router.get(
    "/booked",
    checkRequestToken,
    useSelfData([TokenRole.RESTAURANT]),
    authorizeReqFromRoles([TokenRole.RESTAURANT]),
    (req, res) => {
      controllers.getBooked.handle(req, res);
    }
  );

  router.get(
    "/done",
    checkRequestToken,
    useSelfData([TokenRole.RESTAURANT]),
    authorizeReqFromRoles([TokenRole.RESTAURANT]),
    (req, res) => {
      controllers.getAttend.handle(req, res);
    }
  );

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

  router.patch(
    "/pay-url",
    checkRequestToken,
    authorizeReserveAction([TokenRole.CUSTOMER], authService),
    uploadFile.single("file"),
    (req, res) => {
      controllers.updatePayUrl.handle(req, res);
    }
  );

  router.patch(
    "/payed",
    checkRequestToken,
    authorizeReserveAction([TokenRole.RESTAURANT], authService),
    (req, res) => {
      controllers.updatePayed.handle(req, res);
    }
  );

  router.patch(
    "/attend",
    checkRequestToken,
    authorizeReserveAction([TokenRole.RESTAURANT], authService),
    (req, res) => {
      controllers.updateAttend.handle(req, res);
    }
  );

  // TODO: Implement Cancel Reservation API
  router.patch(
    "/cancel",
    checkRequestToken,
    authorizeReserveAction([TokenRole.RESTAURANT], authService),
    (req, res) => {
      controllers.cancel.handle(req, res);
    }
  );

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
