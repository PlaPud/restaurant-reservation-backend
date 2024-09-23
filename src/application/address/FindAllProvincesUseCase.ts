import { ProvinceJSON } from "../../domain/address/Province";
import { InternalServerError } from "../../errors/HttpError";
import { IThaiAddressRepository } from "../../infrastructure/interfaces/IThaiAddressRepository";
import { IUseCase } from "../../shared/IUseCase";

export interface IFindAllProvincesResult {
  data: ProvinceJSON[];
}

export class FindAllProvincesUseCase
  implements IUseCase<null, IFindAllProvincesResult>
{
  public constructor(private readonly _repository: IThaiAddressRepository) {}

  public async execute(input: null): Promise<IFindAllProvincesResult> {
    const result = await this._repository.findAllProvinces();

    if (!result) throw new InternalServerError();

    const body: IFindAllProvincesResult = {
      data: result.map((p) => p.toJSON()),
    };

    return body;
  }
}
