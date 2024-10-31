import { PrismaClient } from "@prisma/client";
import { randomUUID } from "crypto";
import { Container } from "inversify";
import "reflect-metadata";
import { IReserveRepository } from "../../src/infrastructure/interfaces/IReserveRepository";
import { PrismaReservationRepository } from "../../src/infrastructure/PrismaReservationRepository";
import { RESERVE_T } from "../../src/shared/inversify/reservation.types";
import { TYPES } from "../../src/shared/inversify/types";
import {
  Context,
  createMockContext,
  MockContext,
} from "../infrastructure/context";
import { getMockReservation, getMockRestaurant } from "../shared/mockInstances";
import { getMockedUUIDString } from "../shared/mockUUID";
import { Reservation } from "../../src/domain/Reservation";
import { EntityNotFoundError } from "../../src/errors/DomainError";
import { Restaurant } from "../../src/domain/Restaurant";

let mockCtx: MockContext;
let ctx: Context;
let testContainer: Container;
let idCount: number;

let sut: PrismaReservationRepository;

let mockRestaurants: Restaurant[] = [];

const lastestId = () => getMockedUUIDString(idCount - 1);

const setUp = () => {
  mockCtx = createMockContext();
  testContainer = new Container();
  idCount = 0;

  testContainer
    .bind<PrismaClient>(TYPES.PrismaClient)
    .toConstantValue(mockCtx.prisma);

  testContainer
    .bind<IReserveRepository>(RESERVE_T.PrismaReservationRepository)
    .to(PrismaReservationRepository);

  (randomUUID as jest.Mock).mockImplementation(() => {
    let mockedUUID = getMockedUUIDString(idCount);
    idCount++;
    return mockedUUID;
  });

  sut = testContainer.get<PrismaReservationRepository>(
    RESERVE_T.PrismaReservationRepository
  );
};

const clearDown = () => {
  testContainer.unbindAll();
  idCount = 0;
};

describe("[find()] PrismaReservationRepository", () => {
  beforeEach(() => {
    setUp();
  });

  afterEach(() => {
    clearDown();
  });

  it("Should return reservation with ID if prisma return json result", async () => {
    const rest = getMockRestaurant();

    mockRestaurants.push(rest);

    const newReservation = getMockReservation(lastestId());

    newReservation.restaurant = rest;

    mockCtx.prisma.reservation.findUnique.mockResolvedValue(
      newReservation.toObject()
    );

    const result = await sut.find(newReservation.reserveId);

    expect(mockCtx.prisma.reservation.findUnique).toHaveBeenCalledWith({
      where: {
        reserveId: newReservation.reserveId,
      },
      include: { restaurant: true, customer: true },
    });
    expect(result?.toObject()).toStrictEqual(newReservation.toObject());
  });

  it("Should throw entity not found error if prisma return null", async () => {
    const rest = getMockRestaurant();

    mockRestaurants.push(rest);

    const newReservation = getMockReservation(lastestId());

    newReservation.restaurant = rest;

    mockCtx.prisma.reservation.findUnique.mockResolvedValue(null);

    // expect(mockCtx.prisma.reservation.findUnique).toHaveBeenCalledWith({
    //   where: {
    //     reserveId: newReservation.reserveId,
    //   },
    //   include: { restaurant: true, customer: true },
    // });

    const result: Promise<Reservation | null> = sut.find(
      newReservation.reserveId
    );

    await expect(result).rejects.toBeInstanceOf(EntityNotFoundError);
  });
});
