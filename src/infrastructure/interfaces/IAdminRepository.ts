import { Admin } from "../../domain/Admin";

export interface IAdminRepository {
  find(id: string): Promise<Admin | null>;
}
