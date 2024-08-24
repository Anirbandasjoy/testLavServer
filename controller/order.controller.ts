import { NextFunction, Request, Response } from "express";
import { createError } from "../helper/import";
import Order from "../models/order.model";
import Cart from "../models/cart.model";
import { successResponse } from "../helper/reponse";

export const handleCreateOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req?.user) {
      return next(createError(403, "User not authenticated"));
    }

    const { cartProduct, price } = req.body;

    if (!cartProduct || cartProduct.length === 0) {
      return next(createError(400, "Cart is empty"));
    }

    const newOrder = await Order.create({
      user: req.user._id,
      cart: cartProduct.map((item: any) => item._id),
      price,
    });

    await Cart.deleteMany({
      _id: { $in: cartProduct.map((item: any) => item._id) },
    });

    return res.status(201).json({
      success: true,
      message: "Order created successfully",
      order: newOrder,
    });
  } catch (error) {
    next(error);
  }
};

export const handleFindOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req?.user) {
      return next(createError(403, "User not authenticated"));
    }

    const userId = req.user._id;

    console.log("Fetching orders for user:", userId);

    const orders = await Order.find({ user: userId }).populate("user");

    if (!orders || orders.length === 0) {
      return next(createError(404, "No orders found"));
    }

    successResponse(res, {
      message: "Orders retrieved successfully",
      payload: orders,
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    next(error);
  }
};
