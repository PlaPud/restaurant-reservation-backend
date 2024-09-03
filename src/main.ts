import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
import { ApiServer } from "./presentation/ApiServer";
import { InMemoryCustomerRepository } from "./infrastructure/InMemoryCustomerRepository";
import { PrismaCustomerRepository } from "./infrastructure/PrismaCustomerRepository";
import { CustomerControllers } from "./presentation/controllers/Customer.Controllers";
import { CustomerUseCases } from "./application/Customer.UseCases";
import { Repositories } from "./infrastructure/Repositories";
import prisma from "../tests/infrastructure/client";
import { RestaurantUseCases } from "./application/Restaurant.UseCases";
import { RestaurantControllers } from "./presentation/controllers/Restaurant.Controllers";
import { ReservationUseCases } from "./application/Reservation.UseCases";
import { ReservationControllers } from "./presentation/controllers/Reservation.Controllers";
import { LogoutController } from "./presentation/controllers/authentication/LogoutController";
import { ReservationAuthService } from "./services/ReservationAuthService";
import { AdminUseCases } from "./application/Admin.UseCases";
import { AdminControllers } from "./presentation/controllers/Admin.Controllers";

dotenv.config();

const port = Number(process.env.PORT) || 3000;

export const main = async (): Promise<void> => {
  const repositories = new Repositories(prisma);

  const reserveAuthService = new ReservationAuthService(
    repositories.prismaReservationRepo
  );

  const customerUseCases = new CustomerUseCases(
    repositories.prismaCustomerRepo
  );
  const restaurantUseCases = new RestaurantUseCases(
    repositories.prismaRestaurantRepo
  );
  const reservationUseCases = new ReservationUseCases(
    repositories.prismaReservationRepo
  );
  const adminUseCases = new AdminUseCases(repositories.prismaAdminRepo);

  const customerControllers = new CustomerControllers(customerUseCases);
  const restaurantControllers = new RestaurantControllers(restaurantUseCases);
  const reservationControllers = new ReservationControllers(
    reservationUseCases
  );
  const adminControllers = new AdminControllers(adminUseCases);

  const logoutController = new LogoutController();

  await ApiServer.run({
    port,
    customerControllers,
    restaurantControllers,
    reservationControllers,
    adminControllers,
    logoutController,
    reserveAuthService,
  });
};

main();
