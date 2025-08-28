import { Link, useNavigate } from "react-router";
import { useAddBorrowMutation, useDeleteBookMutation, useGetBooksQuery } from "../redux/api/baseApi";
import type { IBook } from "./IBook";
import { useState } from "react";
import { FiEdit3 } from "react-icons/fi";
import { IoMdRemoveCircleOutline } from "react-icons/io";
import { FiCornerRightDown } from "react-icons/fi";
import Swal from "sweetalert2";
import { Bounce, toast } from "react-toastify";

const Books = () => {
  const navigate = useNavigate();
  const [book, setBookId] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;

  const [filter, setFilter] = useState("");
  const [sort, setSort] = useState("");

  const { data, isLoading } = useGetBooksQuery({ page: currentPage, limit, filter, sort });
  const books = data?.data;
  const totalPages = data?.pagination?.totalPages || 1;

  const [deleteBook] = useDeleteBookMutation();
  const [addBorrow] = useAddBorrowMutation();

  const handleRemove = (bookId: string, title: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteBook(bookId);
        Swal.fire({
          title: "Deleted!",
          text: `${title} has been deleted.`,
          icon: "success",
        });
      }
    });
  };

  if (isLoading) {
    return <h2 className="text-center mt-10">loading...</h2>;
  }

  const handleBorrowBook = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const quantity = (form.quantity as HTMLInputElement).value;
    const dueDate = (form.dueDate as HTMLInputElement).value;

    const borrow = { book, quantity, dueDate };

    addBorrow(borrow).then((result) => {
      if (result.data) {
        form.reset();
        navigate("/borrowSummary");
        toast("✅ Borrow book successfully");
      } else {
        toast.error(`Check book copies!`, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        });
      }
    });
  };

  return (
    <>
      <h2 className="text-center my-5 text-xl">📚 Books</h2>

      <div className="overflow-x-scroll flex w-5/6 mx-auto">
        <div className=" flex flex-col gap-5 min-w-32">
          <div className="space-y-1">
            <label className="block text-sm">Genre</label>
            <select onChange={(e) => setFilter(e.target.value)} className="select select-bordered w-full text-sm p-2">
              <option value="">All Genres</option>
              <option value="FICTION">FICTION</option>
              <option value="SCIENCE">SCIENCE</option>
              <option value="HISTORY">HISTORY</option>
              <option value="BIOGRAPHY">BIOGRAPHY</option>
              <option value="NON_FICTION">NON_FICTION</option>
              <option value="FANTASY">FANTASY</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="block text-sm">ShortBy</label>
            <select onChange={(e) => setSort(e.target.value)} className="select select-bordered w-full">
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>
        </div>

        <div className="divider lg:divider-horizontal"></div>

        <table className="table table-zebra text-sm w-full min-w-4xl">
          <thead className=" text-left">
            <tr className="text-blue-500">
              <th className="px-4 py-2">Title</th>
              <th className="px-4 py-2">Author</th>
              <th className="px-4 py-2">Genre</th>
              <th className="px-4 py-2">ISBN</th>
              <th className="px-4 py-2">Copies</th>
              <th className="px-4 py-2">Available</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody className="">
            {books &&
              !isLoading &&
              books.map((book: IBook) => (
                <tr key={book._id} className="border-t">
                  <td className="px-4 py-2">{book.title}</td>
                  <td className="px-4 py-2">{book.author}</td>
                  <td className="px-4 py-2">{book.genre}</td>
                  <td className="px-4 py-2">{book.isbn}</td>
                  <td className="px-4 py-2">{book.copies}</td>
                  <td className="px-4 py-2">
                    {book.available ? (
                      <span className="font-medium text-xl">✔️</span>
                    ) : (
                      <span className="font-medium">❌</span>
                    )}
                  </td>
                  <td className="flex items-end justify-start gap-5">
                    <Link to={`/books/${book._id}`}>
                      <FiEdit3 size={20} />
                    </Link>
                    <IoMdRemoveCircleOutline
                      size={20}
                      className="cursor-pointer text-red-500"
                      onClick={() => handleRemove(book._id, book.title)}
                    />
                    <FiCornerRightDown
                      size={20}
                      className={`cursor-pointer text-sm ${book.available === false && "hidden"}`}
                      onClick={() => {
                        const modal = document.getElementById("my_modal") as HTMLDialogElement;
                        modal?.showModal();
                        setBookId(book._id);
                      }}
                    />
                  </td>
                </tr>
              ))}
            {books.length === 0 && (
              <tr>
                <td></td>
                <td></td>
                <td></td>
                <td className="text-blue-500 text-center">Books Not found</td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* pagination */}
      <div className="flex justify-center items-center gap-2 my-10">
        <button disabled={currentPage === 1} onClick={() => setCurrentPage((prev) => prev - 1)} className="btn btn-sm">
          Prev
        </button>

        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentPage(index + 1)}
            className={`btn btn-sm ${currentPage === index + 1 ? "btn-active" : ""}`}
          >
            {index + 1}
          </button>
        ))}

        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => prev + 1)}
          className="btn btn-sm"
        >
          Next
        </button>
      </div>

      {/* modal */}
      <dialog id="my_modal" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <h3 className="font-bold mb-3">Borrow Book !</h3>

          <form onSubmit={handleBorrowBook} className="flex flex-col gap-5">
            <input
              type="datetime-local"
              name="dueDate"
              className="w-full border border-gray-500 p-3 rounded"
              placeholder="Please time & date press"
              required
            />
            <input
              type="number"
              name="quantity"
              className="w-full border border-gray-500 p-3 rounded"
              placeholder="Minimum 1 book copy select"
              min={1}
              required
            />

            <button type="submit" className="btn btn-success">
              Submit
            </button>
          </form>

          <div className="modal-action justify-start">
            <form method="dialog">
              <button className="btn">Close</button>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
};

export default Books;
