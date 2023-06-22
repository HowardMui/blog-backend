import { PrismaClient } from "@prisma/client";
import { Request, Router } from "express";
import moment from "moment";
import { generateAuthToken } from "../helper/authHelper";
import { sendEmailToken } from "../services/emailServices";
import bcrypt from "bcrypt";
import { generateUserAuthToken } from "../helper/userAuthHelper";

const EMAIL_TOKEN_EXPIRATION_MINUTES = 10;
const AUTHENTICATION_EXPIRATION_HOURS = 12;

const prisma = new PrismaClient();
const router = Router();

// Generate a random 8 digit number as the email token
function generateEmailToken(): string {
  return Math.floor(10000000 + Math.random() * 90000000).toString();
}

// Create a user, if it doesn't exist,
// generate the emailToken and send it to their email
router.post("/login", async (req, res) => {
  const { email } = req.body;

  // generate token
  const emailToken = generateEmailToken();
  const expiration = moment().add(10, "m").toISOString();

  try {
    // const createdToken = await prisma.token.create({
    //   data: {
    //     type: "EMAIL",
    //     emailToken,
    //     expiration,
    //     user: {
    //       connectOrCreate: {
    //         where: { email },
    //         create: { email },
    //       },
    //     },
    //   },
    // });

    // // TODO send emailToken to user's email
    // await sendEmailToken(email, emailToken);

    // await sendEmailToken(email, emailToken);
    res.status(200).send(`Email has been sent to ${email}`);
  } catch (err) {
    console.log(err);
    res.status(400).json({ error: "Couldn't start the authentication process" });
  }
});

// Validate the emailToken
// Generate a long-lived JWT token
router.post("/authenticate", async (req, res) => {
  try {
    const { email, emailToken } = req.body;

    const dbEmailToken = await prisma.token.findUnique({
      where: {
        emailToken,
      },
      include: {
        user: true,
      },
    });

    if (!dbEmailToken || !dbEmailToken.valid) {
      return res.sendStatus(401);
    }

    if (dbEmailToken.expiration < new Date()) {
      return res.status(401).json({ error: "Token expired!" });
    }

    if (dbEmailToken?.user?.email !== email) {
      return res.sendStatus(401).json({ error: "Email not match" });
    }

    // Here we validated that the user is the owner of the email

    // generate an API token
    const expiration = new Date(new Date().getTime() + AUTHENTICATION_EXPIRATION_HOURS * 60 * 60 * 1000);
    const apiToken = await prisma.token.create({
      data: {
        type: "API",
        expiration,
        user: {
          connect: {
            email,
          },
        },
      },
    });

    // Invalidate the email
    await prisma.token.update({
      where: { tokenId: dbEmailToken.tokenId },
      data: { valid: false },
    });

    // generate the JWT token
    const authToken = generateAuthToken(apiToken.tokenId);

    res.json({ authToken });
  } catch (err) {
    console.log(err);
  }
});

//Sign in with password

router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).send("Please provide email, passwords");
    }

    const findUser = await prisma.user.findUnique({
      where: { email: email },
      include: { UserAuths: true },
    });

    if (findUser && (await bcrypt.compare(password, findUser.UserAuths[0].hash))) {
      const authToken = generateUserAuthToken(findUser.userId);
      return res.status(200).cookie("token", authToken, { sameSite: "none", secure: true }).json({
        token: authToken,
        user: findUser,
      });
    }
  } catch (err) {
    console.log(err);
  }
});

// Register
router.post("/register", async (req: Request, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).send("Please provide email, passwords");
    }

    const findEmail = await prisma.userAuth.findUnique({
      where: { email: email },
    });

    if (findEmail) {
      return res.status(400).send("Email already exist");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        email,
        UserAuths: {
          create: {
            hash: hashedPassword,
            email,
          },
        },
      },
      include: {
        UserAuths: true,
      },
    });

    res.json({ newUser });
  } catch (err) {
    console.log(err);
  }
});

//logout
router.post("/logout", (req, res) => {
  res.clearCookie("token", { sameSite: "none", secure: true });
  res.status(200).json("logout successfully");
});

export { router as authRouter };
