import { model, Schema } from "mongoose";

const foodSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    imageURL: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: String,
      required: true,
      trim: true,
    },
    rating: {
      type: String,
      required: true,
      trim: true,
    },
    details: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

const Food = model("Food", foodSchema);

export default Food;
