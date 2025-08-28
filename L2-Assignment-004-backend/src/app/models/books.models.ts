import { model, Schema } from "mongoose";
import { IBooks } from "../interfaces/books.interfaces";
import { Borrow } from "./borrow.models";

const bookSchema = new Schema<IBooks>(
  {
    title: { type: String, required: true, trim: true },
    author: { type: String, required: true, trim: true },
    genre: {
      type: String,
      enum: ["FICTION", "NON_FICTION", "SCIENCE", "HISTORY", "BIOGRAPHY", "FANTASY"],
      required: true,
      uppercase: true,
    },
    isbn: { type: String, required: true, unique: true, trim: true },
    description: { type: String, trim: true },
    copies: { type: Number, min: 0, required: true },
    available: { type: Boolean, default: true },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

bookSchema.post("findOneAndDelete", async function (doc, next) {
  if (doc) {
    await Borrow.deleteMany({ book: doc._id });
  }
});

export const Book = model<IBooks>("Book", bookSchema);
