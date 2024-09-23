export type DistrictConstrParams = {
  id: number;
  name_th: string;
  name_en: string;
  province_id: number;
};

export interface DistrictJSON {
  id: number;
  name_th: string;
  name_en: string;
  province_id: number;
}

export class District {
  public readonly id: number;
  public readonly name_th: string;
  public readonly name_en: string;
  public readonly province_id: number;

  public constructor(public readonly options: DistrictConstrParams) {
    this.id = options.id;
    this.name_th = options.name_th;
    this.name_en = options.name_en;
    this.province_id = options.province_id;
  }

  public static fromJSON(jsonObj: DistrictJSON): District {
    return new District({
      id: jsonObj.id,
      name_th: jsonObj.name_th,
      name_en: jsonObj.name_en,
      province_id: jsonObj.province_id,
    });
  }

  public toJSON(): DistrictJSON {
    return {
      id: this.id,
      name_th: this.name_th,
      name_en: this.name_en,
      province_id: this.province_id,
    };
  }
}
