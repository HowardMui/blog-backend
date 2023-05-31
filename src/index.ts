import express from "express";
import { userRouter } from "./routers/userRoutes";
import { tweetRouter } from "./routers/tweetRoutes";
import swaggerDocs from "./utils/swagger";
import { authRouter } from "./routers/authRoutes";
import { authenticateToken } from "./middlewares/authMiddleware";

const app = express();
app.use(express.json());

app.use("/users", authenticateToken, userRouter);
app.use("/tweets", authenticateToken, tweetRouter);
app.use("/auths", authRouter);

app.get("/", (req, res) => {
  res.send("hello world");
});

app.listen("8000", () => {
  console.log("running at 8000");
  swaggerDocs(app, 8000);
});
