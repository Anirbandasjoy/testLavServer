import { NextFunction, Request, Response } from "express";
import Food from "../models/food.model";
import { successResponse } from "../helper/reponse";
import { createError } from "../helper/import";

export const handleCreateFood = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, imageURL, category, price, rating, details } = req.body;
    const food = await Food.create({
      name,
      imageURL,
      category,
      price,
      rating,
      details,
    });
    successResponse(res, {
      message: "Food was created",
      payload: food,
    });
  } catch (error: any) {
    next(error);
  }
};

export const handleFindAllFood = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const sortOrder = req.query.sortOrder || "default";
    const search = req.query.search || "";

    const searchRegExp = new RegExp(".*" + search + ".*", "i");

    const filter = {
      $or: [
        {
          name: { $regex: searchRegExp },
        },
        {
          category: { $regex: searchRegExp },
        },
      ],
    };

    let sortOption = {};
    if (sortOrder === "lowtohigh") {
      sortOption = { price: 1 };
    } else if (sortOrder === "hightolow") {
      sortOption = { price: -1 };
    }

    const foods = await Food.find(filter).sort(sortOption);

    successResponse(res, {
      message: "Returned All food",
      payload: foods,
    });
  } catch (error) {
    next(error);
  }
};

export const handleFindSingleFood = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { foodId } = req.params;
    const food = await Food.findById(foodId);
    if (!food) {
      return next(createError(404, "Food not found with this id"));
    }
    successResponse(res, {
      message: "Return Single Food",
      payload: food,
    });
  } catch (error) {
    next(error);
  }
};

export const handleDeleteFood = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { foodId } = req.params;
    const food = await Food.findByIdAndDelete(foodId);
    if (!food) {
      return next(createError(404, "Food not found with this id"));
    }
    successResponse(res, {
      message: "Return Single Food",
      payload: food,
    });
  } catch (error) {
    next(error);
  }
};
