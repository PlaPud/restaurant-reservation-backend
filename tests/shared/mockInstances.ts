import { faker } from "@faker-js/faker";
import { Restaurant } from "../../src/domain/Restaurant";

export const getMockRestaurant = (): Restaurant =>
  new Restaurant(
    undefined,
    faker.company.name(),
    faker.phone.number(),
    faker.location.street()
  );
