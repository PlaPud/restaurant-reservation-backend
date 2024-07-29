import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
import { ApiServer } from "./presentation/ApiServer";
import { InMemoryCustomerRepository } from "./infrastructure/InMemoryCustomerRepository";
import { PrismaCustomerRepository } from "./infrastructure/PrismaCustomerRepository";
import { CustomerControllers } from "./presentation/controllers/Customer.Controllers";
import { CustomerUseCases } from "./application/Customer.UseCases";

dotenv.config();

const port = Number(process.env.PORT) || 3000;

export const main = async (): Promise<void> => {
  const prismaClient = new PrismaClient();

  const prismaRepo = new PrismaCustomerRepository(prismaClient);
  const inMemoryRepo = new InMemoryCustomerRepository();

  const repository = prismaRepo;

  const customerUseCases = new CustomerUseCases(repository);

  const customerControllers = new CustomerControllers(customerUseCases);

  await ApiServer.run(port, customerControllers);
};

main();
