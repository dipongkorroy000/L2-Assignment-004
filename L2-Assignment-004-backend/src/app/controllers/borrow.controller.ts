import express, { Request, Response } from "express";
import { Borrow } from "../models/borrow.models";
import { Book } from "../models/books.models";

export const borrowRoutes = express.Router();

borrowRoutes.post("/", async (req: Request, res: Response) => {
  const body = req.body;
  const { quantity, book, dueDate } = body;

  const findBook = await Book.findById({ _id: book });

  if (findBook.available && findBook.copies >= quantity) {
    const data = await Borrow.create({ quantity, book, dueDate });

    const available = findBook.copies - quantity ? true : false;
    const updateDoc = { copies: findBook.copies - quantity, available: available };

    await Book.updateOne({ _id: book }, { $set: updateDoc });

    res.status(200).json({
      success: true,
      message: "Book borrowed successfully",
      data: data,
    });
  } else {
    res.status(400).json({ success: false, message: "Book borrowed failed" });
  }
});

borrowRoutes.get("/", async (req: Request, res: Response) => {
  const result = await Borrow.aggregate([
    {
      $group: {
        _id: { $toObjectId: "$book" },
        totalQuantity: { $sum: 1 },
      },
    },
    {
      $lookup: {
        from: "books",
        localField: "_id",
        foreignField: "_id",
        as: "book",
      },
    },
    { $unwind: "$book" },
    {
      $project: {
        _id: 0,
        totalQuantity: 1,
        book: {
          title: "$book.title",
          isbn: "$book.isbn",
        },
      },
    },
    { $sort: { totalQuantity: 1 } },
  ]);

  res.status(200).json({
    success: true,
    message: "Borrowed books summary retrieved successfully",
    data: result,
  });
});
