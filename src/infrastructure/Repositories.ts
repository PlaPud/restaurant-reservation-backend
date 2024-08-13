import { PrismaClient } from "@prisma/client";
import { InMemoryCustomerRepository } from "./InMemoryCustomerRepository";
import { PrismaCustomerRepository } from "./PrismaCustomerRepository";

export class Repositories {
  public readonly inMemoryCustomerRepo: InMemoryCustomerRepository;
  public readonly prismaCustomerRepo: PrismaCustomerRepository;

  public constructor(private readonly _prismaClient: PrismaClient) {
    this.inMemoryCustomerRepo = new InMemoryCustomerRepository();
    this.prismaCustomerRepo = new PrismaCustomerRepository(this._prismaClient);
  }
}
