import { NextFunction, Request, Response } from "express";
import Cart from "../models/cart.model";
import { successResponse } from "../helper/reponse";
import { createError } from "../helper/import";

export const handleAddToCard = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return next(createError(403, "User not authnticated"));
    }
    const { foodId, quantity, price } = req.body;
    console.log({ foodId });
    const cart = await Cart.create({
      user: req.user?._id,
      food: foodId,
      quantity,
      price,
    });
    successResponse(res, {
      message: "Added Cart",
      payload: cart,
    });
  } catch (error) {
    next(error);
  }
};

export const handleFindUserCartData = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return next(createError(403, "User not authenticated"));
    }

    const cartData = await Cart.find({ user: req.user._id })
      .populate("user")
      .populate("food");

    successResponse(res, {
      message: "Returned cart data",
      payload: cartData,
    });
  } catch (error) {
    next(error);
  }
};

export const handleDeleteCartProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const foodId = req.query.foodId;

    const food = await Cart.findByIdAndDelete(foodId);
    if (!food) {
      return next(createError(404, "Food not found with this id"));
    }

    successResponse(res, {
      message: "Return this food",
      payload: food,
    });
  } catch (error) {
    next(error);
  }
};
