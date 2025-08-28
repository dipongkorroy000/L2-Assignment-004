import { useForm } from "react-hook-form";
import { useAddBookMutation } from "../redux/api/baseApi";
import type { IBook } from "./IBook";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";

const AddBook = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Omit<IBook, "_id">>();
  const [addBook, { isLoading }] = useAddBookMutation();

  const onSubmit = async (data: Omit<IBook, "_id">) => {
    await addBook(data);
    toast("✅ Book added successfully!");
    reset();
    navigate("/");
  };

  return (
    <section>
      <h2 className="text-xl font-semibold mb-6 text-center">📘 Add New Book</h2>

      {isLoading && <p className="text-center text-blue-500 mb-4">Submitting...</p>}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-3/6 min-w-sm mx-auto">
        {/* Title */}
        <div>
          <input
            type="text"
            placeholder="Title"
            {...register("title", { required: "Title is required" })}
            className="w-full px-4 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring"
          />
          {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
        </div>

        {/* Author */}
        <div>
          <input
            type="text"
            placeholder="Author"
            {...register("author", { required: "Author is required" })}
            className="w-full px-4 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring"
          />
          {errors.author && <p className="text-red-500 text-sm mt-1">{errors.author.message}</p>}
        </div>

        {/* ISBN */}
        <div>
          <input
            type="text"
            placeholder="ISBN"
            {...register("isbn", { required: "ISBN is required" })}
            className="w-full px-4 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring"
          />
          {errors.isbn && <p className="text-red-500 text-sm mt-1">{errors.isbn.message}</p>}
        </div>

        {/* Copies */}
        <div>
          <input
            type="number"
            placeholder="Number of Copies"
            {...register("copies", {
              required: "Copies are required",
              min: { value: 1, message: "Must be at least 1 copy" },
            })}
            className="w-full px-4 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring"
          />
          {errors.copies && <p className="text-red-500 text-sm mt-1">{errors.copies.message}</p>}
        </div>

        {/* Genre Dropdown */}
        <div>
          <select
            {...register("genre", { required: "Genre is required" })}
            className="w-full px-4 py-2 border border-gray-400 rounded-md "
          >
            <option value="">Select Genre</option>
            <option value="FICTION">Fiction</option>
            <option value="NON_FICTION">Non-Fiction</option>
            <option value="SCIENCE">Science</option>
            <option value="HISTORY">History</option>
            <option value="BIOGRAPHY">Biography</option>
            <option value="FANTASY">Fantasy</option>
          </select>
          {errors.genre && <p className="text-red-500 text-sm mt-1">{errors.genre.message}</p>}
        </div>

        {/* Description */}
        <textarea
          placeholder="Description (optional)"
          {...register("description")}
          className="w-full px-4 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring"
        />

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
        >
          {isLoading ? "Adding..." : "Add Book"}
        </button>
      </form>
    </section>
  );
};

export default AddBook;
