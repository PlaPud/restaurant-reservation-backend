export interface AdminJSON {
  adminId: string;
  fName: string;
  lName: string;
  hashPassword: string;
}

export type AdminConstrParams = {
  adminId: string;
  fName: string;
  lName: string;
  hashPassword: string;
};

export class Admin {
  public readonly adminId: string;
  public readonly fName: string;
  public readonly lName: string;
  public readonly hashPassword: string;

  constructor(public readonly options: AdminConstrParams) {
    this.adminId = options.adminId;
    this.fName = options.fName;
    this.lName = options.lName;
    this.hashPassword = options.hashPassword;
  }

  public static fromJSON(jsonObj: AdminJSON): Admin {
    return new Admin(jsonObj);
  }

  public toJSON(): AdminJSON {
    return {
      adminId: this.adminId,
      fName: this.fName,
      lName: this.lName,
      hashPassword: this.hashPassword,
    };
  }
}
