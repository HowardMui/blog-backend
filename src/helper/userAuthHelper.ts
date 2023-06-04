import jwt, { SignOptions } from "jsonwebtoken";
import { JWT_SECRET } from "../config";

export function generateUserAuthToken(tokenId: number): string {
  const jwtPayload = { userId: tokenId };

  const option: SignOptions = {
    algorithm: "HS256",
    expiresIn: "180 days",
  };

  return jwt.sign(jwtPayload, JWT_SECRET, option);
}
