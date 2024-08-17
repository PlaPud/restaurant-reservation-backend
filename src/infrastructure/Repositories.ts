import { Prisma, PrismaClient } from "@prisma/client";
import { InMemoryCustomerRepository } from "./InMemoryCustomerRepository";
import { PrismaCustomerRepository } from "./PrismaCustomerRepository";
import { InMemoryRestaurantRepository } from "./InMemoryRestaurantRepository";
import { PrismaRestaurantRepository } from "./PrismaRestaurantRepository";
import { InMemoryReserveRepository } from "./InMemoryReserveRepository";

export class Repositories {
  public readonly inMemoryCustomerRepo: InMemoryCustomerRepository;
  public readonly inMemoryRestaurantRepo: InMemoryRestaurantRepository;
  public readonly inMemoryReserveRepo: InMemoryReserveRepository;

  public readonly prismaCustomerRepo: PrismaCustomerRepository;
  public readonly prismaRestaurantRepo: PrismaRestaurantRepository;

  public constructor(private readonly _prismaClient: PrismaClient) {
    this.inMemoryCustomerRepo = new InMemoryCustomerRepository();
    this.inMemoryRestaurantRepo = new InMemoryRestaurantRepository();
    this.inMemoryReserveRepo = new InMemoryReserveRepository();

    this.prismaCustomerRepo = new PrismaCustomerRepository(this._prismaClient);
    this.prismaRestaurantRepo = new PrismaRestaurantRepository(
      this._prismaClient
    );
  }
}
