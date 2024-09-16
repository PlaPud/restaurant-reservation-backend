import { TokenRole } from "../../shared/enum/TokenRole";

export interface IImageRepository {
  uploadPaymentImage(img: Buffer): Promise<string | null>;
  deletePaymentImage(path: string): Promise<boolean>;
  uploadProfileImage(img: Buffer, role: TokenRole): Promise<string | null>;
  deleteProfileImage(path: string): Promise<boolean>;
}
