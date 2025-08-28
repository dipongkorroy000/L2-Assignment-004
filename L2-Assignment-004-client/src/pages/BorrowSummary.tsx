import { useGetBorrowQuery } from "../redux/api/baseApi";

const BorrowSummary = () => {
  const { data, isLoading } = useGetBorrowQuery(undefined);
  const borrow = data?.data;

  interface Item {
    totalQuantity: number;
    book: {
      title: string;
      isbn: string;
    };
  }

  if (isLoading) {
    return <h2 className="text-center mt-10">Loading...</h2>;
  }

  return (
    <section>
      <h2 className="text-xl font-semibold mb-4 mt-8 text-center">📊 Borrow Summary</h2>

      <table className="w-4/6 min-w-sm mx-auto border border-gray-200 divide-y divide-gray-200">
        <thead className="">
          <tr className="text-blue-500">
            <th className="px-4 py-2 text-left text-sm font-medium ">Title</th>
            <th className="px-4 py-2 text-left text-sm font-medium ">ISBN</th>
            <th className="px-4 py-2 text-left text-sm font-medium ">Total Quantity</th>
          </tr>
        </thead>
        <tbody className=" divide-y divide-gray-100">
          {borrow.map((item: Item, index: number) => (
            <tr key={index} className="">
              <td className="px-4 py-2 text-sm ">{item?.book.title}</td>
              <td className="px-4 py-2 text-sm">{item?.book.isbn}</td>
              <td className="px-4 py-2 text-sm">{item?.totalQuantity}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

export default BorrowSummary;
