import { Prisma, PrismaClient } from "@prisma/client";
import { InMemoryCustomerRepository } from "./InMemoryCustomerRepository";
import { PrismaCustomerRepository } from "./PrismaCustomerRepository";
import { InMemoryRestaurantRepository } from "./InMemoryRestaurantRepository";
import { PrismaRestaurantRepository } from "./PrismaRestaurantRepository";
import { InMemoryReserveRepository } from "./InMemoryReserveRepository";
import { PrismaReservationRepository } from "./PrismaReservationRepository";
import { PrismaAdminRepository } from "./PrismaAdminRepository";
import { FirebaseImgRepository } from "./firebase/FirebaseImgRepository";
import { PrismaThaiAddrRepository } from "./PrismaThaiAddrRepository";

export class Repositories {
  public readonly inMemoryCustomerRepo: InMemoryCustomerRepository;
  public readonly inMemoryRestaurantRepo: InMemoryRestaurantRepository;
  public readonly inMemoryReserveRepo: InMemoryReserveRepository;

  public readonly prismaCustomerRepo: PrismaCustomerRepository;
  public readonly prismaRestaurantRepo: PrismaRestaurantRepository;
  public readonly prismaReservationRepo: PrismaReservationRepository;
  public readonly prismaThaiAddressRepo: PrismaThaiAddrRepository;
  public readonly prismaAdminRepo: PrismaAdminRepository;

  public readonly firebaseImgRepo: FirebaseImgRepository;

  public constructor(private readonly _prismaClient: PrismaClient) {
    this.inMemoryCustomerRepo = new InMemoryCustomerRepository();
    this.inMemoryRestaurantRepo = new InMemoryRestaurantRepository();
    this.inMemoryReserveRepo = new InMemoryReserveRepository();

    this.prismaCustomerRepo = new PrismaCustomerRepository(this._prismaClient);
    this.prismaRestaurantRepo = new PrismaRestaurantRepository(
      this._prismaClient
    );
    this.prismaReservationRepo = new PrismaReservationRepository(
      this._prismaClient
    );
    this.prismaThaiAddressRepo = new PrismaThaiAddrRepository(
      this._prismaClient
    );
    this.prismaAdminRepo = new PrismaAdminRepository(this._prismaClient);

    this.firebaseImgRepo = new FirebaseImgRepository();
  }
}
