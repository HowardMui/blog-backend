import express from "express";
import { userRouter } from "./routers/userRoutes";
import { tweetRouter } from "./routers/tweetRoutes";

const app = express();
app.use(express.json());
app.use("/users", userRouter);
app.use("/tweets", tweetRouter);

app.get("/", (req, res) => {
  res.send("hello world");
});

app.listen("8000", () => {
  console.log("running at 8000");
});
