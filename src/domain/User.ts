import { TokenRole } from "../shared/enum/TokenRole";

export type UserConstrParams = {
  role: TokenRole | null;
  id: string | null;
};

export interface UserJSONResponse {
  role: TokenRole | null;
  id: string | null;
}

export interface UserObj extends UserJSONResponse {}

export class User {
  public readonly role: TokenRole | null = null;
  public readonly id: string | null = null;

  public constructor(public readonly options: UserConstrParams) {
    this.role = options.role ?? null;
    this.id = options.id ?? null;
  }

  public static fromJSON(jsonObj: UserObj): User {
    return new User({
      role: jsonObj.role,
      id: jsonObj.id,
    });
  }

  public toObject(): UserObj {
    return {
      role: this.role,
      id: this.id,
    };
  }

  public toJSONResponse(): UserJSONResponse {
    const { ...rest } = this.toObject();

    return rest;
  }
}
