import { PrismaClient } from "@prisma/client";
import { Request, Response, Router } from "express";

const prisma = new PrismaClient();

const router = Router();

// Get All user

router.get("/", async (req, res) => {
  try {
    const allUser = await prisma.user.findMany({
      include: {
        tweets: true,
      },
    });
    res.send(allUser).status(200);
  } catch (err) {
    res.status(400).json("Failed to get user list");
  }
});

// Get One user

router.get("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const findOne = await prisma.user.findUnique({
      where: { userId: parseInt(id) },
      include: {
        tweets: true,
      },
    });
    if (!findOne) {
      res.status(404).json("Cannot find user");
    }
    res.json(findOne);
  } catch (err) {
    console.log(err);
    res.status(400).json("Failed to get one user");
  }
});

// Post One user

router.post("/", async (req: Request, res: Response) => {
  const { email, username } = req.body;

  try {
    const result = await prisma.user.create({
      data: {
        email,
        username,
        bio: "Hello.  Testing",
      },
    });
    res.json(result).status(201);
  } catch (err) {
    console.log(err);
    res.status(400).json("error for the username or email");
  }
});

// Update User

router.put("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { bio, username, image } = req.body;

  try {
    const params = {
      bio,
      username,
      image,
    };
    const result = await prisma.user.update({ where: { userId: parseInt(id) }, data: params });
    res.status(200).json(result);
  } catch (err) {
    console.log(err);
    res.status(400).json("failed to update ");
  }
});

// Delete User

router.delete("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    if (id) {
      await prisma.user.delete({ where: { userId: parseInt(id) } });
      res.status(200).json(`Deleted ${id}`);
    }
  } catch (err) {
    console.log(err);
    res.status(400).json("failed to delete ");
  }
});

export { router as userRouter };
