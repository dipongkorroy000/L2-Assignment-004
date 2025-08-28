import express, { Request, Response, NextFunction } from "express";
import { Book } from "../models/books.models";

export const booksRoutes = express.Router();

booksRoutes.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const book = await req.body;

    if (book.copies > 0) {
      const result = await Book.create(book);
      res.status(200).json({
        success: true,
        message: "Book created successfully",
        data: result,
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Book must be 1 copy",
      });
    }
  } catch (err) {
    next(err);
  }
});

booksRoutes.get("/", async (req: Request, res: Response) => {
  try {
    const {
      filter,
      sortBy = "title", // default sort field
      sort = "asc", // default sort order
      limit = "10", // default items per page
      page = "1", // default page number
    } = req.query;

    // console.log(req.query);

    const numericLimit = parseInt(limit as string);
    const numericPage = parseInt(page as string);
    const skip = (numericPage - 1) * numericLimit;

    const query: any = {};

    if (filter) {
      query.genre = filter;
    }

    const books = await Book.find(query)
      .sort({ [sortBy as string]: sort === "desc" ? -1 : 1 })
      .skip(skip)
      .limit(numericLimit);

    res.status(200).json({
      success: true,
      message: "Books retrieved successfully",
      data: books,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve books",
      error: error.message,
    });
  }
});

booksRoutes.get("/:bookId", async (req: Request, res: Response) => {
  const book = await Book.findById({ _id: req.params.bookId });
  res.status(200).json({
    success: true,
    message: "Book retrieved successfully",
    data: book,
  });
});

booksRoutes.patch("/:bookId", async (req: Request, res: Response) => {
  const { title, author, genre, isbn, description, available, copies } = req.body;
  // console.log(req.body);

  const book = await Book.findOneAndUpdate(
    { _id: req.params.bookId },
    { $set: { title, author, genre, isbn, description, available, copies } }
  );
  res.status(200).json({
    success: true,
    message: "Book updated successfully",
    data: book,
  });
});

booksRoutes.delete("/:bookId", async (req: Request, res: Response) => {
  const book = await Book.findOneAndDelete({ _id: req.params.bookId });

  if (book) {
    res.status(200).json({
      success: true,
      message: "Book deleted successfully",
      data: null,
    });
  } else {
    res.status(200).json({
      success: false,
      message: "Book deleted failed",
      data: null,
    });
  }
});
