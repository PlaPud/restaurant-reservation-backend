import { InternalServerError } from "../../errors/HttpError";
import { ICustomerRepository } from "../../infrastructure/interfaces/ICustomerRepository";
import { IImageRepository } from "../../infrastructure/interfaces/IImageRepository";
import { TokenRole } from "../../shared/enum/TokenRole";
import { IUseCase } from "../../shared/IUseCase";

export interface IUpdateCusProImgDto {
  customerId: string;
  profileImg: Buffer;
}

export interface IUpdateCusProImgResult {
  customerId: string;
  fName: string;
  lName: string;
  phone: string;
  email: string;
  profileImgPath: string;
}

export class UpdateCustomerProfileImgUseCase
  implements IUseCase<IUpdateCusProImgDto, IUpdateCusProImgResult>
{
  public constructor(
    private readonly _repository: ICustomerRepository,
    private readonly _imageRepo: IImageRepository
  ) {}

  public async execute(
    input: IUpdateCusProImgDto
  ): Promise<IUpdateCusProImgResult> {
    const imgPath = await this._imageRepo.uploadProfileImage(
      input.profileImg,
      TokenRole.CUSTOMER
    );

    if (!imgPath) throw new InternalServerError();

    const result = await this._repository.updateProfileImgPath(
      input.customerId,
      imgPath
    );

    if (!result) throw new InternalServerError();

    return result.toObject() as IUpdateCusProImgResult;
  }
}
