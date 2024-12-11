import axios from 'axios';
import React, { useEffect, useState } from 'react';

interface Transaction {
  itemId: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  sold: boolean;
  dateOfSale: string;
}

interface TransactionTableProps {
  selectedMonth: string;
}

const TransactionTable: React.FC<TransactionTableProps> = ({ selectedMonth }) => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [totalPages, setTotalPages] = useState(1);

  const transactionsPerPage = 10;

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/transactions', {
        params: {
          month: selectedMonth,
          page: page,
          limit: transactionsPerPage,
        },
      });
      setTransactions(response.data.transactions);
      setTotalPages(response.data.totalPages);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [selectedMonth, page]);

  const formatDate = (dateString: string) => {
    const dateParts = dateString.split('T')[0]; 
    return dateParts;
  };

  const filteredTransactions = transactions.filter(transaction =>
    transaction.title.toLowerCase().includes(search.toLowerCase()) ||
    transaction.description.toLowerCase().includes(search.toLowerCase()) ||
    transaction.category.toLowerCase().includes(search.toLowerCase()) ||
    transaction.price.toString().includes(search)
  );

  return (
    <div className="mx-auto p-4">
      <input
        type="text"
        placeholder="Search by title, description, price or category"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full mb-4 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500 bg-gray-800"
      />

      {loading ? (
        <div className="text-center text-gray-500">Loading transactions...</div>
      ) : filteredTransactions.length > 0 ? (
        <div className="overflow-x-auto rounded-lg">
          <table className="min-w-full bg-gray-950 border border-gray-700 shadow-md">
            <thead>
              <tr className="bg-blue-950 text-white">
                <th className="py-2 px-4 text-left">ID</th>
                <th className="py-2 px-4 text-left">Title</th>
                <th className="py-2 px-4 text-left">Description</th>
                <th className="py-2 px-4 text-right">Price</th>
                <th className="py-2 px-4 text-left">Category</th>
                <th className="py-2 px-4 text-center">Sold</th>
                <th className="py-2 px-4 text-left">Image</th>
                <th className="py-2 px-4 text-center">Date of Sale</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((transaction) => (
                <tr key={transaction.itemId} className="border-t hover:bg-gray-900">
                  <td className="py-2 px-4">{transaction.itemId}</td>
                  <td className="py-2 px-4">{transaction.title}</td>
                  <td className="py-2 px-4">{transaction.description}</td>
                  <td className="py-2 px-4 text-right">${transaction.price}</td>
                  <td className="py-2 px-4">{transaction.category}</td>
                  <td className="py-2 px-4 text-center">
                    {transaction.sold ? "Yes" : "No"}
                  </td>
                  <td className="py-2 px-4">
                    <img src={transaction.image} alt={transaction.title} className="w-20 h-20 object-cover" />
                  </td>
                  <td className="py-2 px-4 text-center">
                    {formatDate(transaction.dateOfSale)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center text-gray-500">No transactions found</p>
      )}

      <div className="mt-4 flex justify-between">
        <button
          onClick={() => setPage(page - 1)}
          disabled={page <= 1}
          className={`px-4 py-2 rounded-md text-white ${page <= 1 ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
        >
          Previous
        </button>
        <button
          onClick={() => setPage(page + 1)}
          disabled={page >= totalPages}
          className={`px-4 py-2 rounded-md text-white ${page >= totalPages ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default TransactionTable;
