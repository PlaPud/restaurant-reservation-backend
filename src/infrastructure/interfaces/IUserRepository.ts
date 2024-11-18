import { User } from "../../domain/User";

export interface IUserRepository {
  getRole(): Promise<User>;
}
