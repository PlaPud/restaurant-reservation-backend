import { Prisma, PrismaClient } from "@prisma/client";
import { InMemoryCustomerRepository } from "./InMemoryCustomerRepository";
import { PrismaCustomerRepository } from "./PrismaCustomerRepository";
import { InMemoryRestaurantRepository } from "./InMemoryRestaurantRepository";
import { PrismaRestaurantRepository } from "./PrismaRestaurantRepository";

export class Repositories {
  public readonly inMemoryCustomerRepo: InMemoryCustomerRepository;
  public readonly prismaCustomerRepo: PrismaCustomerRepository;
  public readonly inMemoryRestaurantRepo: InMemoryRestaurantRepository;
  public readonly prismaRestaurantRepo: PrismaRestaurantRepository;

  public constructor(private readonly _prismaClient: PrismaClient) {
    this.inMemoryCustomerRepo = new InMemoryCustomerRepository();
    this.inMemoryRestaurantRepo = new InMemoryRestaurantRepository();
    this.prismaCustomerRepo = new PrismaCustomerRepository(this._prismaClient);
    this.prismaRestaurantRepo = new PrismaRestaurantRepository(
      this._prismaClient
    );
  }
}
