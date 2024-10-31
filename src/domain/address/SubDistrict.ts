export type SubDistConstrParams = {
  id: number;
  zip_code: number;
  name_th: string;
  name_en: string;
  amphure_id: number;
};

export interface SubDistrictJSON {
  id: number;
  zip_code: number;
  name_th: string;
  name_en: string;
  amphure_id: number;
}

export class SubDistrict {
  public readonly id: number;
  public readonly zip_code: number;
  public readonly name_th: string;
  public readonly name_en: string;
  public readonly amphure_id: number;

  public constructor(public readonly options: SubDistConstrParams) {
    this.id = options.id;
    this.zip_code = options.zip_code;
    this.name_th = options.name_th;
    this.name_en = options.name_en;
    this.amphure_id = options.amphure_id;
  }

  public static fromJSON(jsonObj: SubDistrictJSON): SubDistrict {
    return new SubDistrict({
      id: jsonObj.id,
      zip_code: jsonObj.zip_code,
      name_th: jsonObj.name_th,
      name_en: jsonObj.name_en,
      amphure_id: jsonObj.amphure_id,
    });
  }

  public toJSON(): SubDistrictJSON {
    return {
      id: this.id,
      zip_code: this.zip_code,
      name_th: this.name_th,
      name_en: this.name_en,
      amphure_id: this.amphure_id,
    };
  }
}
