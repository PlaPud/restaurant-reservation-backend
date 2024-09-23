import { PrismaClient } from "@prisma/client";
import { District } from "../domain/address/District";
import { Province } from "../domain/address/Province";
import { SubDistrict } from "../domain/address/SubDistrict";
import { IThaiAddressRepository } from "./interfaces/IThaiAddressRepository";
import { NotFoundError } from "../errors/HttpError";

export class PrismaThaiAddrRepository implements IThaiAddressRepository {
  public constructor(private readonly _client: PrismaClient) {}

  public async findAllProvinces(): Promise<Province[]> {
    const result = await this._client.thai_provinces.findMany();

    return result.map((p) => Province.fromJSON(p));
  }
  public async findDistrictsByProvince(
    provinceId: number
  ): Promise<District[]> {
    const result = await this._client.thai_amphures.findMany({
      where: {
        province_id: provinceId,
      },
    });

    if (result.length === 0) {
      throw new NotFoundError(`Cannot Find Province. (ID: ${provinceId})`);
    }

    return result.map((d) => District.fromJSON(d));
  }
  public async findSubDistsByDistrict(
    districtId: number
  ): Promise<SubDistrict[]> {
    const result = await this._client.thai_tambons.findMany({
      where: {
        amphure_id: districtId,
      },
    });

    if (result.length === 0) {
      throw new NotFoundError(`Cannot Find District. (ID: ${districtId})`);
    }

    return result.map((ds) => SubDistrict.fromJSON(ds));
  }
}
