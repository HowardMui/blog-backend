import { PrismaClient } from "@prisma/client";
import { Request, Response, Router } from "express";

const prisma = new PrismaClient();

const router = Router();

// Get All user
router.get("/", async (req, res) => {
  const allUser = await prisma.user.findMany();

  // res.json(allUser);
  res.send(allUser);
});

// Get One user

router.get("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const findOne = await prisma.user.findUnique({ where: { userId: parseInt(id) } });
  res.json(findOne);
});

// Post One user

router.post("/user", async (req: Request, res: Response) => {
  const reqBody = req.body;

  console.log(reqBody);

  // const allUser = await prisma.user.findMany();

  // res.json(allUser);
});

// Update User

router.put("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
});

// Delete User

router.delete("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
});

export { router as userRouter };
