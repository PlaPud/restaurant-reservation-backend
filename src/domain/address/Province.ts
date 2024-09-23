export type ProvinceConstrParams = {
  id: number;
  name_th: string;
  name_en: string;
  geography_id: number;
};

export interface ProvinceJSON {
  id: number;
  name_th: string;
  name_en: string;
  geography_id: number;
}

export class Province {
  public readonly id: number;
  public readonly name_th: string;
  public readonly name_en: string;
  public readonly geography_id: number;

  public constructor(public readonly options: ProvinceConstrParams) {
    this.id = options.id;
    this.name_th = options.name_th;
    this.name_en = options.name_en;
    this.geography_id = options.geography_id;
  }

  public static fromJSON(jsonObj: ProvinceJSON): Province {
    return new Province({
      id: jsonObj.id,
      name_th: jsonObj.name_th,
      name_en: jsonObj.name_en,
      geography_id: jsonObj.geography_id,
    });
  }

  public toJSON(): ProvinceJSON {
    return {
      id: this.id,
      name_th: this.name_th,
      name_en: this.name_en,
      geography_id: this.geography_id,
    };
  }
}
