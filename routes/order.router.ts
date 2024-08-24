import { Router } from "express";
import { isLogin } from "../middleware/auth";
import {
  handleCreateOrder,
  handleFindOrder,
} from "../controller/order.controller";
const orderRouter = Router();

orderRouter.post("/create", isLogin, handleCreateOrder);
orderRouter.get("/find", isLogin, handleFindOrder);

export default orderRouter;
