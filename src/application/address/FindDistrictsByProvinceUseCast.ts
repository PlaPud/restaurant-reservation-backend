import { District, DistrictJSON } from "../../domain/address/District";
import { InternalServerError } from "../../errors/HttpError";
import { IThaiAddressRepository } from "../../infrastructure/interfaces/IThaiAddressRepository";
import { IUseCase } from "../../shared/IUseCase";

export interface IFindDistsByProvinceDto {
  id: number;
}

export interface IFindDistsByProvinceResult {
  province_id: number;
  data: DistrictJSON[];
}

export class FindDistrictsByProvinceUseCase
  implements IUseCase<IFindDistsByProvinceDto, IFindDistsByProvinceResult>
{
  public constructor(private readonly _repository: IThaiAddressRepository) {}

  public async execute(
    input: IFindDistsByProvinceDto
  ): Promise<IFindDistsByProvinceResult> {
    const result = await this._repository.findDistrictsByProvince(input.id);

    if (!result) throw new InternalServerError();

    const body: IFindDistsByProvinceResult = {
      province_id: input.id,
      data: result.map((d) => d.toJSON()),
    };

    return body;
  }
}
