"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.booksRoutes = void 0;
const express_1 = __importDefault(require("express"));
const books_models_1 = require("../models/books.models");
exports.booksRoutes = express_1.default.Router();
exports.booksRoutes.post("/", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const book = yield req.body;
        if (book.copies > 0) {
            const result = yield books_models_1.Book.create(book);
            res.status(200).json({
                success: true,
                message: "Book created successfully",
                data: result,
            });
        }
        else {
            res.status(400).json({
                success: false,
                message: "Book must be 1 copy",
            });
        }
    }
    catch (err) {
        next(err);
    }
}));
exports.booksRoutes.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { filter, sortBy = "title", // default sort field
        sort = "asc", // default sort order
        limit = "10", // default items per page
        page = "1", // default page number
         } = req.query;
        // console.log(req.query);
        const numericLimit = parseInt(limit);
        const numericPage = parseInt(page);
        const skip = (numericPage - 1) * numericLimit;
        const query = {};
        if (filter) {
            query.genre = filter;
        }
        const books = yield books_models_1.Book.find(query)
            .sort({ [sortBy]: sort === "desc" ? -1 : 1 })
            .skip(skip)
            .limit(numericLimit);
        res.status(200).json({
            success: true,
            message: "Books retrieved successfully",
            data: books,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to retrieve books",
            error: error.message,
        });
    }
}));
exports.booksRoutes.get("/:bookId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const book = yield books_models_1.Book.findById({ _id: req.params.bookId });
    res.status(200).json({
        success: true,
        message: "Book retrieved successfully",
        data: book,
    });
}));
exports.booksRoutes.patch("/:bookId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, author, genre, isbn, description, available, copies } = req.body;
    // console.log(req.body);
    const book = yield books_models_1.Book.findOneAndUpdate({ _id: req.params.bookId }, { $set: { title, author, genre, isbn, description, available, copies } });
    res.status(200).json({
        success: true,
        message: "Book updated successfully",
        data: book,
    });
}));
exports.booksRoutes.delete("/:bookId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const book = yield books_models_1.Book.findOneAndDelete({ _id: req.params.bookId });
    if (book) {
        res.status(200).json({
            success: true,
            message: "Book deleted successfully",
            data: null,
        });
    }
    else {
        res.status(200).json({
            success: false,
            message: "Book deleted failed",
            data: null,
        });
    }
}));
