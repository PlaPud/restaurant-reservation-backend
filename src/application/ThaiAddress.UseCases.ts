import { IThaiAddressRepository } from "../infrastructure/interfaces/IThaiAddressRepository";
import { FindAllProvincesUseCase } from "./address/FindAllProvincesUseCase";
import { FindDistrictsByProvinceUseCase } from "./address/FindDistrictsByProvinceUseCast";
import { FindSubDistsByDistrictUseCase } from "./address/FindSubDistsByDistrictUseCase";

export class ThaiAddressUseCases {
  public readonly findAllProvinces: FindAllProvincesUseCase;
  public readonly findDistsByProvince: FindDistrictsByProvinceUseCase;
  public readonly findSubDistsByDistrict: FindSubDistsByDistrictUseCase;

  public constructor(private readonly _repository: IThaiAddressRepository) {
    this.findAllProvinces = new FindAllProvincesUseCase(_repository);
    this.findDistsByProvince = new FindDistrictsByProvinceUseCase(_repository);
    this.findSubDistsByDistrict = new FindSubDistsByDistrictUseCase(
      _repository
    );
  }
}
