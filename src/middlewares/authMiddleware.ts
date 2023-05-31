import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config";
import moment from "moment";
import { PrismaClient, User } from "@prisma/client";

type AuthRequest = Request & { user?: User };

const prisma = new PrismaClient();

export const authenticateToken = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"];

  const JWTtoken = authHeader?.split(" ")[1];

  if (!JWTtoken) {
    return res.sendStatus(401);
  }

  try {
    const payload = (await jwt.verify(JWTtoken, JWT_SECRET)) as { tokenId: number };
    const findDbToken = await prisma.token.findUnique({
      where: { tokenId: payload.tokenId },
      include: { user: true },
    });
    if (!findDbToken?.valid || !moment(findDbToken.expiration).isAfter(moment().toISOString())) {
      return res.status(401).json({ error: "API token expired" });
    }

    // add user properties into request
    req.user = findDbToken.user;
  } catch (err) {
    return res.sendStatus(401);
  }
  next();
};
