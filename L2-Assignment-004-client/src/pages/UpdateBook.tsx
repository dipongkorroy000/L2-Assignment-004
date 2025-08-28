import { useNavigate, useParams } from "react-router";
import { useForm } from "react-hook-form";
import { useGetBookQuery, useUpdateBookMutation } from "../redux/api/baseApi";
import type { IBook } from "./IBook";
import { useEffect } from "react";
import { toast } from "react-toastify";

const UpdateBook = () => {
  const { bookId } = useParams();
  const { data, isLoading } = useGetBookQuery(bookId, { skip: !bookId });
  const [updateBook] = useUpdateBookMutation();
  const navigate = useNavigate();

  const book = data?.data;

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<IBook>();

  useEffect(() => {
    if (book) {
      reset(book);
    }
  }, [book, reset]);

  const onSubmit = async (formData: IBook) => {
    try {
      await updateBook({ bookId, formData }).unwrap();
      toast("✅ Book updated successfully!");
      navigate(-1);
    } catch (error) {
      console.error("❌ Update failed:", error);
    }
  };

  if (isLoading) {
    return <h1 className="text-center mt-10">Loading...</h1>;
  }

  return (
    book && (
      <div className="max-w-4xl mx-auto mt-10 p-6 shadow-md rounded-md">
        <h2 className="text-2xl font-semibold mb-6 text-center">📘 Update Book</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-medium">Title</label>
              <input {...register("title")} className="input input-bordered w-full" />
            </div>
            <div>
              <label className="block font-medium">Author</label>
              <input {...register("author")} className="input input-bordered w-full" />
            </div>
            <div>
              <label className="block font-medium">Genre</label>
              <select {...register("genre")} className="select select-bordered w-full">
                <option value="FICTION">FICTION</option>
                <option value="SCIENCE">SCIENCE</option>
                <option value="HISTORY">HISTORY</option>
                <option value="BIOGRAPHY">BIOGRAPHY</option>
                <option value="NON_FICTION">NON_FICTION</option>
                <option value="FANTASY">FANTASY</option>
              </select>
            </div>
            <div>
              <label className="block font-medium">ISBN</label>
              <input {...register("isbn")} className="input input-bordered w-full" />
            </div>
            <div>
              <label className="block font-medium">Copies</label>
              <input type="number" {...register("copies")} className="input input-bordered w-full" />
            </div>
            <div>
              <label className="block font-medium">Available</label>
              <select {...register("available")} className="select select-bordered w-full">
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block font-medium">Description</label>
            <textarea {...register("description")} className="textarea textarea-bordered w-full" rows={4} />
          </div>
          <button type="submit" disabled={isSubmitting} className="btn btn-primary w-full mt-4">
            {isSubmitting ? "Updating..." : "Update Book"}
          </button>
        </form>
      </div>
    )
  );
};

export default UpdateBook;
