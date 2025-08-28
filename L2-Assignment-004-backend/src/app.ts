import express, { Application, Request, Response, NextFunction } from "express";
import { booksRoutes } from "./app/controllers/books.controller";
import { borrowRoutes } from "./app/controllers/borrow.controller";
import cors from "cors";

const app: Application = express();
app.use(express.json());
app.use(cors({ origin: ["http://localhost:5173", "https://l2-assignment-004-client.vercel.app"] }));

app.use("/api/books", booksRoutes);

app.use("/api/borrow", borrowRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

// when any route not match then call this middleware
app.use((req: Request, res: Response) => {
  res.status(404).json({ message: "Route Not Found" });
});

app.use((error: any, req: Request, res: Response, next: NextFunction) => {
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

export default app;
