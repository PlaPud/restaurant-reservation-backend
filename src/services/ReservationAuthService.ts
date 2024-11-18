import { JwtPayload } from "jsonwebtoken";
import { IReserveRepository } from "../infrastructure/interfaces/IReserveRepository";
import { EntityNotFoundError } from "../errors/DomainError";
import { TokenRole } from "../shared/enum/TokenRole";
import { BadRequestError } from "../errors/HttpError";
import { UnauthorizedActionError } from "../errors/UseCaseError";

export class ReservationAuthService {
  public constructor(private readonly _repository: IReserveRepository) {}

  public async validateOwnership(reserveId: string, payload: JwtPayload) {
    const target = await this._repository.find(reserveId);

    if (!target)
      throw new EntityNotFoundError(
        `Cannot find reservation (ID: ${reserveId})`
      );

    const { customerId, restaurantId } = target;

    switch (payload.role) {
      case TokenRole.CUSTOMER:
        if (customerId && customerId !== payload.sub)
          throw new UnauthorizedActionError(
            `Cannot edit other customer reservation.`
          );
        break;
      case TokenRole.RESTAURANT:
        if (restaurantId && restaurantId !== payload.sub)
          throw new UnauthorizedActionError(
            `Cannot edit other restaurant reservation.`
          );
        break;
      default:
        throw new BadRequestError();
    }
  }
}
