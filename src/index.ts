import express from "express";
import { userRouter } from "./routers/userRoutes";
import { tweetRouter } from "./routers/tweetRoutes";
import swaggerDocs from "./utils/swagger";
import { authRouter } from "./routers/authRoutes";
import { authenticateToken } from "./middlewares/authMiddleware";
var cors = require("cors");
import cookieParser from "cookie-parser";

const app = express();
app.use(cookieParser());
// app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
// app.use(cors({ credentials: true, origin: "*" }));
// app.use(cors());
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
