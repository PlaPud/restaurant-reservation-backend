import { InternalServerError } from "../../errors/HttpError";
import { ICustomerRepository } from "../../infrastructure/interfaces/ICustomerRepository";
import { IImageRepository } from "../../infrastructure/interfaces/IImageRepository";
import { IUseCase } from "../../shared/IUseCase";

export interface IDeleteCusProDto {
  customerId: string;
}

export interface IDeleteCusProResult {
  customerId: string;
  fName: string;
  lName: string;
  email: string;
  phone: string;
  profileImgPath: string;
}

export class DeleteCustomerProfImgUseCase
  implements IUseCase<IDeleteCusProDto, IDeleteCusProResult>
{
  public constructor(
    private readonly _repository: ICustomerRepository,
    private readonly _imgRepo: IImageRepository
  ) {}

  public async execute(input: IDeleteCusProDto): Promise<IDeleteCusProResult> {
    const customer = await this._repository.find(input.customerId);

    if (!customer) throw new InternalServerError();

    const isImgDeleted = await this._imgRepo.deleteProfileImage(
      customer.profileImgPath
    );

    if (!isImgDeleted) throw new InternalServerError();

    const result = await this._repository.updateProfileImgPath(
      input.customerId,
      ""
    );

    if (!result) throw new InternalServerError();

    const body: IDeleteCusProResult = {
      customerId: result.customerId,
      fName: result.fName,
      lName: result.lName,
      email: result.email,
      phone: result.phone,
      profileImgPath: result.profileImgPath,
    };

    return body;
  }
}
