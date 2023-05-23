import { Request, Response, Router } from "express";

const router = Router();

// Get All user
router.get("/", async (req, res) => {
  res.send("tweets route");
});

// Get One user

router.get("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
});

// Update User

router.put("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
});

// Delete User

router.delete("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
});

export { router as tweetRouter };
