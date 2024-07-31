import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
import { ApiServer } from "./presentation/ApiServer";
import { InMemoryCustomerRepository } from "./infrastructure/InMemoryCustomerRepository";
import { PrismaCustomerRepository } from "./infrastructure/PrismaCustomerRepository";
import { CustomerControllers } from "./presentation/controllers/Customer.Controllers";
import { CustomerUseCases } from "./application/Customer.UseCases";
import { Repositories } from "./infrastructure/Repositories";
import prisma from "../tests/infrastructure/client";

dotenv.config();

const port = Number(process.env.PORT) || 3000;

export const main = async (): Promise<void> => {
  const repositories = new Repositories(prisma);

  const customerUseCases = new CustomerUseCases(
    repositories.prismaCustomerRepo
  );

  const customerControllers = new CustomerControllers(customerUseCases);

  await ApiServer.run(port, customerControllers);
};

main();
