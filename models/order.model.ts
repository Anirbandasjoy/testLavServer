import { Schema, model } from "mongoose";

const orderSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    cart: [
      {
        type: Schema.Types.ObjectId,
        ref: "Food",
        required: true,
      },
    ],
    status: {
      type: String,
      enum: ["pending", "completed", "cancelled"],
      default: "pending",
    },
    price: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Order = model("Order", orderSchema);

export default Order;
