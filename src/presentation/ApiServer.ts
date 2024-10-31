import express, { NextFunction, Request, Response } from "express";
import { customerRouter } from "./routers/Customer.Routes";
import { CustomerControllers } from "./controllers/Customer.Controllers";
import { RestaurantControllers } from "./controllers/Restaurant.Controllers";
import { restaurantRouter } from "./routers/Restaurant.Routes";
import { reservationRouter } from "./routers/Reservation.Routes";
import { ReservationControllers } from "./controllers/Reservation.Controllers";
import cookieParser from "cookie-parser";
import { LogoutController } from "./controllers/auth/LogoutController";
import { sendErrorResponse } from "../shared/sendErrorResponse";
import { ReservationAuthService } from "../services/ReservationAuthService";
import { AdminControllers } from "./controllers/Admin.Controllers";
import { adminRouter } from "./routers/Admin.Routes";
import multer from "multer";
import { ThaiAddressControllers } from "./controllers/ThaiAddress.Controllers";
import { thaiAddressRouter } from "./routers/ThaiAddress.Routes";
import cors from "cors";
import { UserControllers } from "./controllers/User.Controllers";
import { userRouter } from "./routers/User.Routes";
export class ApiServer {
  public static run = async (options: {
    port: number;
    userControllers: UserControllers;
    customerControllers: CustomerControllers;
    restaurantControllers: RestaurantControllers;
    reservationControllers: ReservationControllers;
    thaiAddressControllers: ThaiAddressControllers;
    adminControllers: AdminControllers;
    logoutController: LogoutController;
    reserveAuthService: ReservationAuthService;
  }): Promise<void> => {
    const {
      port,
      userControllers,
      customerControllers,
      restaurantControllers,
      reservationControllers,
      thaiAddressControllers,
      adminControllers,
      logoutController,
      reserveAuthService,
    } = options;

    const app = express();

    app.use(
      cors<Request>({
        origin: process.env.ORIGIN_URL,
        credentials: true,
      })
    );

    app.use(express.json());
    app.use(cookieParser());

    app.get("/", (req, res) => res.send("Pong!"));

    app.use("/customers", customerRouter(customerControllers));
    app.use("/restaurants", restaurantRouter(restaurantControllers));
    app.use(
      "/reservations",
      reservationRouter(reservationControllers, reserveAuthService)
    );
    app.use("/address", thaiAddressRouter(thaiAddressControllers));

    app.use("/user", userRouter(userControllers));
    app.use("/admin", adminRouter(adminControllers));

    app.post("/logout", (req, res) => {
      logoutController.handle(req, res);
    });

    app.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
      console.log(err);
      sendErrorResponse(res, err);
    });

    app.listen(port, () => {
      console.log("Server is running");
    });
  };
}
