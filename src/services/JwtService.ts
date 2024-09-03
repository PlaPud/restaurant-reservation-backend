import bcrypt from "bcrypt";
import { UnauthorizedActionError } from "../errors/UseCaseError";
import jwt, { JwtPayload } from "jsonwebtoken";
import { TokenRole } from "../shared/enum/TokenRole";

interface IPayloadDto {
  sub: string;
  iat: number;
  role: TokenRole;
}

interface IPasswordDto {
  password: string | Buffer;
  hashPassword: string;
}

export interface IVerifyRoleResult {
  payload: any;
  isAuthorized: boolean;
}

export class JwtService {
  private readonly _secret: string;
  private readonly _expTime: string;

  constructor() {
    this._secret = String(process.env.JWT_SECRET);
    this._expTime = String(process.env.JWT_EXP_TIME);
  }

  public async getToken(options: {
    payload: IPayloadDto;
    verifyData: IPasswordDto;
  }): Promise<string> {
    const isPasswordCorrect = await bcrypt.compare(
      options.verifyData.password,
      options.verifyData.hashPassword
    );

    options.verifyData.password = "";

    if (!isPasswordCorrect) throw new UnauthorizedActionError(`Wrong Password`);

    const token = jwt.sign(options.payload, this._secret, {
      expiresIn: this._expTime,
    });

    return token;
  }

  public async verifyToken(token: string): Promise<JwtPayload> {
    const result = jwt.verify(token, this._secret) as JwtPayload;

    return result;
  }

  public async verifyTokenRole(options: {
    token: string;
    toHaveRole: TokenRole[];
  }): Promise<IVerifyRoleResult> {
    let isAuthorized: boolean = false;
    let payload: any;

    jwt.verify(options.token, this._secret, (err, decoded) => {
      if (err) throw new UnauthorizedActionError(err.message);

      payload = decoded as any;

      isAuthorized = options.toHaveRole.some((role) => payload.role === role);
    });

    const result: IVerifyRoleResult = {
      payload,
      isAuthorized,
    };

    return result;
  }
}
