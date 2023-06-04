import { JwtPayload } from "jsonwebtoken";

export interface UserJWTAuth extends JwtPayload {
  userId: number;
}
