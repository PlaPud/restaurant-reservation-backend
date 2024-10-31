import { District } from "../../domain/address/District";
import { Province } from "../../domain/address/Province";
import { SubDistrict } from "../../domain/address/SubDistrict";

export interface IThaiAddressRepository {
  findAllProvinces(): Promise<Province[]>;

  findDistrictsByProvince(provinceId: number): Promise<District[]>;

  findSubDistsByDistrict(districtId: number): Promise<SubDistrict[]>;
}
