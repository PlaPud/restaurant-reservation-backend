import { RestaurantObj } from "../../domain/Restaurant";
import { InternalServerError } from "../../errors/HttpError";
import { ICustomerRepository } from "../../infrastructure/interfaces/ICustomerRepository";
import { IImageRepository } from "../../infrastructure/interfaces/IImageRepository";
import { IRestaurantRepository } from "../../infrastructure/interfaces/IRestaurantRepository";
import { TokenRole } from "../../shared/enum/TokenRole";
import { IUseCase } from "../../shared/IUseCase";

export interface IUpdateResProfileDto {
  restaurantId: string;
  profileImg: Buffer;
}

export interface IUpdateResProfileResult {
  restaurantId: string;
  name: string;
  phone: string;
  email: string;
  description: string;
  address: string;
  profileImgPath: string;
}

export class UpdateRestaurantProfileImgUseCase
  implements IUseCase<IUpdateResProfileDto, IUpdateResProfileResult>
{
  public constructor(
    private readonly _repository: IRestaurantRepository,
    private readonly _imageRepo: IImageRepository
  ) {}

  public async execute(
    input: IUpdateResProfileDto
  ): Promise<IUpdateResProfileResult> {
    const imgPath = await this._imageRepo.uploadProfileImage(
      input.profileImg,
      TokenRole.RESTAURANT
    );

    if (!imgPath) throw new InternalServerError();
    const restaurant = await this._repository.find(input.restaurantId);

    if (!restaurant) throw new InternalServerError();

    if (restaurant.profileImgPath !== "") {
      await this._imageRepo.deletePaymentImage(restaurant.profileImgPath);
    }

    const result = await this._repository.updateProfileImgPath(
      input.restaurantId,
      imgPath
    );

    if (!result) throw new InternalServerError();

    return result.toObject() as IUpdateResProfileResult;
  }
}
