import express from "express";
import { userRouter } from "./routers/userRoutes";
import { tweetRouter } from "./routers/tweetRoutes";
import swaggerDocs from "./utils/swagger";
import { authRouter } from "./routers/authRoutes";
import { authenticateToken } from "./middlewares/authMiddleware";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();
app.use(cookieParser());
// app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
// app.use(cors({ credentials: true, origin: "*" }));
app.use(
  cors({
    credentials: true,
    origin: function (origin, callback) {
      callback(null, true);
    },
  })
);
app.use(express.json());

app.use("/users", authenticateToken, userRouter);
app.use("/tweets", tweetRouter);
app.use("/auths", authRouter);

app.get("/", (req, res) => {
  res.send("hello world server side");
});

app.listen("8000", () => {
  console.log("running at 8000");
  swaggerDocs(app, 8000);
});
