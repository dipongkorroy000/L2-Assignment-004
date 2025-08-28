import { model, Schema } from "mongoose";
import { IBorrow } from "../interfaces/borrow.interfaces";

const borrowSchema = new Schema<IBorrow>(
  {
    book: { type: String, required: true },
    dueDate: { type: String, required: true },
    quantity: { type: Number, required: true },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

export const Borrow = model<IBorrow>("Borrow", borrowSchema);
