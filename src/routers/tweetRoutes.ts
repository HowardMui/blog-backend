import { Request, Response, Router } from "express";
import { PrismaClient } from "@prisma/client";
import { authenticateToken } from "../middlewares/authMiddleware";

const prisma = new PrismaClient();

const router = Router();

interface ExpressRequest extends Request {
  user?: any;
}

// Get All Tweet
router.get("/", async (req: Request, res) => {
  try {
    const findAllTweets = await prisma.tweet.findMany({
      include: {
        user: true,
        likes: {
          include: {
            user: true,
          },
        },
        comments: {
          include: {
            user: true,
          },
        },
        // select within include
        // user: {
        //   select: {
        //     userId: true,
        //   },
        // },
      },
    });

    // const mapComments = findAllTweets.map((tweet) => {
    //   const mapObj = {
    //     count: tweet.comments.length,
    //     rows: tweet.comments,
    //   };
    //   return { ...tweet, comments: mapObj };
    // });

    res.status(200).json(findAllTweets);
  } catch (err) {
    console.log(err);
    res.status(400).json("Failed to get tweet data");
  }
});

// Get One Tweet

router.get("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const findOne = await prisma.tweet.findFirst({
      where: { tweetId: Number(id) },
      include: {
        user: true,
        likes: {
          include: {
            user: true,
          },
        },
        comments: {
          include: {
            user: true,
          },
        },
      },
    });
    if (!findOne) {
      res.status(404).json("Cannot find tweet");
    }
    res.status(200).json(findOne);
  } catch (err) {
    console.log(err);
    res.status(400).json("Failed to get one tweet data");
  }
});

// Create one Tweet
router.post("/", authenticateToken, async (req: ExpressRequest, res: Response) => {
  const { image, content, impression } = req.body;

  const user = req?.user;

  try {
    const params = {
      image,
      content,
      impression,
      userId: user.userId,
    };
    const createRes = await prisma.tweet.create({
      data: params,
    });
    res.status(201).json(createRes);
  } catch (err) {
    console.log(err);
    res.status(400).json("Failed to create tweet");
  }
});

// Update Tweet

router.put("/:id", authenticateToken, async (req: Request, res: Response) => {
  const { id } = req.params;
  const { image, content, impression } = req.body;

  try {
    const params = {
      image,
      content,
      impression,
    };
    const updateRes = await prisma.tweet.update({
      where: { tweetId: Number(id) },
      data: params,
    });
    res.status(201).json(updateRes);
  } catch (err) {
    res.status(400).json("Failed to update tweet");
  }
});

// Delete Tweet

router.delete("/:id", authenticateToken, async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await prisma.tweet.delete({
      where: { tweetId: Number(id) },
    });
    res.status(201).json("Deleted tweet");
  } catch (err) {
    res.status(400).json("Failed to delete tweet");
  }
});

export { router as tweetRouter };
