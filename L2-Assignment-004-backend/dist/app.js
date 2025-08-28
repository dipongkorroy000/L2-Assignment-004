"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const books_controller_1 = require("./app/controllers/books.controller");
const borrow_controller_1 = require("./app/controllers/borrow.controller");
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)({ origin: ["http://localhost:5173", "https://l2-assignment-004-client.vercel.app"] }));
app.use("/api/books", books_controller_1.booksRoutes);
app.use("/api/borrow", borrow_controller_1.borrowRoutes);
app.get("/", (req, res) => {
    res.send("Hello World!");
});
// when any route not match then call this middleware
app.use((req, res) => {
    res.status(404).json({ message: "Route Not Found" });
});
app.use((error, req, res, next) => {
    // when error call --> must be call next
    if (error) {
        res.status(400).json({
            message: "Validation failed",
            success: false,
            error: {
                name: "ValidationError",
                errors: {
                    copies: {
                        message: "Copies must be a positive number",
                        name: "ValidatorError",
                        properties: {
                            message: "Copies must be a positive number",
                            type: "min",
                            min: 0,
                        },
                        kind: "min",
                        path: "copies",
                        value: -5,
                    },
                },
            },
        });
    }
});
exports.default = app;
