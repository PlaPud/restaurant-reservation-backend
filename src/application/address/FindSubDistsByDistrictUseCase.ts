import { SubDistrictJSON } from "../../domain/address/SubDistrict";
import { InternalServerError } from "../../errors/HttpError";
import { IThaiAddressRepository } from "../../infrastructure/interfaces/IThaiAddressRepository";
import { IUseCase } from "../../shared/IUseCase";

export interface IFindSubDistsByDistrictDto {
  id: number;
}

export interface IFindSubDistsByDistrictResult {
  district_id: number;
  data: SubDistrictJSON[];
}

export class FindSubDistsByDistrictUseCase
  implements
    IUseCase<IFindSubDistsByDistrictDto, IFindSubDistsByDistrictResult>
{
  public constructor(private readonly _repository: IThaiAddressRepository) {}

  public async execute(
    input: IFindSubDistsByDistrictDto
  ): Promise<IFindSubDistsByDistrictResult> {
    const result = await this._repository.findSubDistsByDistrict(input.id);

    if (!result) throw new InternalServerError();

    const body: IFindSubDistsByDistrictResult = {
      district_id: input.id,
      data: result.map((ds) => ds.toJSON()),
    };

    return body;
  }
}
