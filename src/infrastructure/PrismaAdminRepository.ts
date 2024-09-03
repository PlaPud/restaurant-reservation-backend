import { PrismaClient } from "@prisma/client";
import { Admin } from "../domain/Admin";
import { IAdminRepository } from "./interfaces/IAdminRepository";
import { EntityNotFoundError } from "../errors/DomainError";

export class PrismaAdminRepository implements IAdminRepository {
  public constructor(private readonly _client: PrismaClient) {}

  public async find(id: string): Promise<Admin | null> {
    const result = await this._client.admin.findUnique({
      where: { adminId: id },
    });

    if (!result) throw new EntityNotFoundError();

    return Admin.fromJSON(result);
  }
}
