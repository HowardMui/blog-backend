import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config";
import moment from "moment";
import { PrismaClient, User } from "@prisma/client";
import { UserJWTAuth } from "../Model";

type AuthRequest = Request & { user?: User };

const prisma = new PrismaClient();

export const authenticateToken = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const userToken = req.cookies["token"];

  // const authHeader = req.headers["authorization"];
  // const cookie = req.headers["cookie"];

  // let newJWT: string | null = null;

  // if (cookie) {
  //   const newJWTTokenIndex =
  //     cookie
  //       .split(/\;|\=/)
  //       .map((el) => el.trim())
  //       .findIndex((el) => el === "token") + 1;
  //   newJWT = cookie.split(/\;|\=/)[newJWTTokenIndex];
  // }

  // const JWTtoken = authHeader?.split(" ")[1];

  if (!userToken) {
    return res.sendStatus(401);
  }

  // console.log(newJWT);

  try {
    const payload = (await jwt.verify(userToken, JWT_SECRET)) as UserJWTAuth;

    const exp = moment(payload.exp! * 1000).toISOString();

    if (!payload.userId) {
      return res.status(401).json({ error: "UnAuthorized" });
    } else if (!moment(exp).isAfter(moment().toISOString())) {
      return res.status(401).json({ error: "API token expired" });
    }

    const findDbToken = await prisma.user.findUnique({
      where: { userId: payload.userId },
      // include: { user: true },
    });

    // console.log(findDbToken);
    // if (!findDbToken?.valid || !moment(findDbToken.expiration).isAfter(moment().toISOString())) {
    //   return res.status(401).json({ error: "API token expired" });
    // }

    // add user properties into request
    // req.user = findDbToken.user;
  } catch (err) {
    return res.sendStatus(401);
  }
  next();
};
