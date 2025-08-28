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
exports.borrowRoutes = void 0;
const express_1 = __importDefault(require("express"));
const borrow_models_1 = require("../models/borrow.models");
const books_models_1 = require("../models/books.models");
exports.borrowRoutes = express_1.default.Router();
exports.borrowRoutes.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const { quantity, book, dueDate } = body;
    const findBook = yield books_models_1.Book.findById({ _id: book });
    if (findBook.available && findBook.copies >= quantity) {
        const data = yield borrow_models_1.Borrow.create({ quantity, book, dueDate });
        const available = findBook.copies - quantity ? true : false;
        const updateDoc = { copies: findBook.copies - quantity, available: available };
        yield books_models_1.Book.updateOne({ _id: book }, { $set: updateDoc });
        res.status(200).json({
            success: true,
            message: "Book borrowed successfully",
            data: data,
        });
    }
    else {
        res.status(400).json({ success: false, message: "Book borrowed failed" });
    }
}));
exports.borrowRoutes.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield borrow_models_1.Borrow.aggregate([
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
}));
