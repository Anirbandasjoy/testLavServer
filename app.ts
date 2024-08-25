import express, { NextFunction, Request, Response } from "express";
const app = express();
import cors from "cors";
import "dotenv/config";
import "./config/passport";
import session from "express-session";
import passport from "passport";
import { cookieParser, createError } from "./helper/import";
import { errorResponse } from "./helper/reponse";
import userRouter from "./routes/user.router";
import authRouter from "./routes/auth.router";
import foodRouter from "./routes/food.router";
import cartRouter from "./routes/cart.router";
import orderRouter from "./routes/order.router";
const corsOptions = {
  origin: ["http://localhost:5173", "https://testylav.vercel.app"],
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: "session_secret",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());

app.use("/api/v1/user", userRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/food", foodRouter);
app.use("/api/v1/cart", cartRouter);
app.use("/api/v1/order", orderRouter);

app.get("/", (req: Request, res: Response) => {
  res.json({
    message: "Hello, I am testylav server.",
  });
});

app.use((req: Request, res: Response, next: NextFunction) => {
  next(createError(404, "route not found"));
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  return errorResponse(res, {
    statusCode: err.status,
    message: err.message,
  });
});

export default app;
