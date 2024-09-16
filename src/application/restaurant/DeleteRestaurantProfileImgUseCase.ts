import { InternalServerError } from "../../errors/HttpError";
import { IImageRepository } from "../../infrastructure/interfaces/IImageRepository";
import { IRestaurantRepository } from "../../infrastructure/interfaces/IRestaurantRepository";
import { IUseCase } from "../../shared/IUseCase";

export interface IDeleteResProfileDto {
  restaurantId: string;
}

export interface IDeleteResProfileResult {
  restaurantId: string;
  name: string;
  phone: string;
  email: string;
  description: string;
  address: string;
  profileImgPath: string;
}

export class DeleteRestaurantProfileImgUseCase
  implements IUseCase<IDeleteResProfileDto, IDeleteResProfileResult>
{
  public constructor(
    private readonly _repository: IRestaurantRepository,
    private readonly _imgRepo: IImageRepository
  ) {}

  public async execute(
    input: IDeleteResProfileDto
  ): Promise<IDeleteResProfileResult> {
    const restaurant = await this._repository.find(input.restaurantId);

    if (!restaurant) throw new InternalServerError();

    const isImgDeleted = await this._imgRepo.deleteProfileImage(
      restaurant.profileImgPath
    );

    if (!isImgDeleted) throw new InternalServerError();

    const result = await this._repository.updateProfileImgPath(
      input.restaurantId,
      ""
    );

    if (!result) throw new InternalServerError();

    const body: IDeleteResProfileResult = {
      restaurantId: result.restaurantId,
      name: result.name,
      phone: result.phone,
      email: result.email,
      description: result.description,
      address: result.address,
      profileImgPath: result.profileImgPath,
    };

    return body;
  }
}
