import { ThaiAddressUseCases } from "../../application/ThaiAddress.UseCases";
import { FindAllProvincesController } from "./address/FindAllProvincesController";
import { FindDistrictsByProvinceController } from "./address/FindDistrictsByProvinceController";
import { FindSubDistsByDistrictController } from "./address/FindSubDistsByDistrictController";

export class ThaiAddressControllers {
  public readonly findAllProvinces: FindAllProvincesController;
  public readonly findDistsByProvince: FindDistrictsByProvinceController;
  public readonly findSubDistsByDistrict: FindSubDistsByDistrictController;

  public constructor(private readonly _useCases: ThaiAddressUseCases) {
    this.findAllProvinces = new FindAllProvincesController(
      _useCases.findAllProvinces
    );
    this.findDistsByProvince = new FindDistrictsByProvinceController(
      _useCases.findDistsByProvince
    );
    this.findSubDistsByDistrict = new FindSubDistsByDistrictController(
      _useCases.findSubDistsByDistrict
    );
  }
}
