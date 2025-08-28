import { createBrowserRouter } from "react-router";
import Layout from "../layout/Layout";
import Books from "../pages/Books";
import UpdateBook from "../pages/UpdateBook";
import AddBook from "../pages/AddBook";
import BorrowSummary from "../pages/BorrowSummary";

const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      {
        index: true,
        Component: Books,
      },
      {
        path: "/books/:bookId",
        Component: UpdateBook,
      },
      {
        path: "/addBook",
        Component: AddBook,
      },
      {
        path: "/borrowSummary",
        Component: BorrowSummary,
      },
    ],
  },
]);

export default router;
