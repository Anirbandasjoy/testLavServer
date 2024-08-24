import { Router } from "express";
import {
  handleCreateFood,
  handleDeleteFood,
  handleFindAllFood,
  handleFindSingleFood,
} from "../controller/food.controller";
import { isAdmin, isLogin } from "../middleware/auth";

const foodRouter = Router();

foodRouter.post("/create", isLogin, isAdmin, handleCreateFood);
foodRouter.get("/find", handleFindAllFood);
foodRouter.get("/find-single-food/:foodId", isLogin, handleFindSingleFood);
foodRouter.delete("/delete/:foodId", isLogin, isAdmin, handleDeleteFood);

export default foodRouter;
