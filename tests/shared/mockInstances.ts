import { faker } from "@faker-js/faker";
import { Restaurant } from "../../src/domain/Restaurant";
import { Customer } from "../../src/domain/Customer";
import { Reservation } from "../../src/domain/Reservation";

export const getMockRestaurant = (): Restaurant =>
  new Restaurant({
    name: faker.company.name(),
    phone: faker.phone.number(),
    address: faker.location.street(),
    subDistrict: faker.location.street(),
    district: faker.location.city(),
    province: faker.location.state(),
    email: faker.internet.email(),
    hashPassword: faker.string.alphanumeric({ length: 10, casing: "mixed" }),
  });

export const getMockCustomer = (): Customer =>
  new Customer({
    fName: faker.person.firstName(),
    lName: faker.person.lastName(),
    email: faker.internet.email(),
    phone: faker.phone.number(),
    hashPassword: faker.string.alphanumeric({ length: 10, casing: "mixed" }),
  });

export const getMockReservation = (restaurantId: string) =>
  new Reservation({
    restaurantId,
    seats: faker.number.int(),
    reservePrice: faker.number.int(),
    reserveDate: faker.date.future().getTime(),
  });
