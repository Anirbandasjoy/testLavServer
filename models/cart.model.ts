import { model, Schema } from "mongoose";

const cartSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    food: {
      type: Schema.Types.ObjectId,
      ref: "Food",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
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

const Cart = model("Cart", cartSchema);

export default Cart;
