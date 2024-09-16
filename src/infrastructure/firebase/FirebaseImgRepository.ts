import { RepositoryError } from "../../errors/RepositoryError";
import { TokenRole } from "../../shared/enum/TokenRole";
import { IImageRepository } from "../interfaces/IImageRepository";
import { storageRootRef } from "./FireBaseAppInit";
import { deleteObject, ref, uploadBytes } from "firebase/storage";

export class FirebaseImgRepository implements IImageRepository {
  private readonly _rootRef = storageRootRef;

  public constructor() {}

  public async uploadPaymentImage(img: Buffer): Promise<string | null> {
    if (!img) return null;

    const paymentPath = ref(this._rootRef, `payment/payment_${Date.now()}.jpg`);

    const result = await uploadBytes(paymentPath, img);

    console.log(result.metadata.fullPath);

    return result.metadata.fullPath;
  }

  public async deletePaymentImage(path: string): Promise<boolean> {
    try {
      const paymentPath = ref(this._rootRef, path);

      await deleteObject(paymentPath);

      return true;
    } catch (err) {
      throw new RepositoryError(`Firebase Error ERR: ${err}`);
    }
  }

  public async uploadProfileImage(
    img: Buffer,
    role: TokenRole
  ): Promise<string | null> {
    try {
      const profilePath = ref(
        this._rootRef,
        `profile/${role}/profile_${Date.now()}`
      );

      const result = await uploadBytes(profilePath, img);

      console.log(result.metadata.fullPath);

      return result.metadata.fullPath;
    } catch (err) {
      throw new RepositoryError(`Firebase Error ERR: ${err}`);
    }
  }

  public async deleteProfileImage(path: string): Promise<boolean> {
    try {
      const profilePath = ref(this._rootRef, path);

      await deleteObject(profilePath);

      return true;
    } catch (err) {
      throw new RepositoryError(`Firebase Error ERR: ${err}`);
    }
  }
}
