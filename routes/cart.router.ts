import { Router } from "express";
import { isLogin } from "../middleware/auth";
import {
  handleAddToCard,
  handleDeleteCartProduct,
  handleFindUserCartData,
} from "../controller/cart.controller";
const cartRouter = Router();

cartRouter.post("/create", isLogin, handleAddToCard);
cartRouter.get("/user-cart-data", isLogin, handleFindUserCartData);
cartRouter.delete("/delete", isLogin, handleDeleteCartProduct);

export default cartRouter;
