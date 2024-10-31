import { TokenRole } from "../shared/enum/TokenRole";

export type UserConstrParams = {
  role: TokenRole | null;
};

export interface UserJSONResponse {
  role: TokenRole | null;
}

export interface UserObj extends UserJSONResponse {}

export class User {
  public readonly role: TokenRole | null = null;

  public constructor(public readonly options: UserConstrParams) {
    this.role = options.role ?? null;
  }

  public static fromJSON(jsonObj: UserObj): User {
    return new User({
      role: jsonObj.role,
    });
  }

  public toObject(): UserObj {
    return {
      role: this.role,
    };
  }

  public toJSONResponse(): UserJSONResponse {
    const { ...rest } = this.toObject();

    return rest;
  }
}
