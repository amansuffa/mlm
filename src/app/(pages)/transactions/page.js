"use client";
import { useEffect, useState } from "react";

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const res = await fetch("/api/transactions");
      const data = await res.json();
      setTransactions(data);
    }
    fetchData();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-700 mb-6">💳 Transactions</h2>

      <div className="bg-white p-6 rounded-2xl shadow-lg overflow-x-auto">
        <div className="min-w-[700px]">
          <table className="w-full text-sm table-auto border-collapse">
            <thead>
              <tr className="bg-gray-100 text-gray-600 text-left">
                <th className="p-3 font-semibold">Date</th>
                <th className="p-3 font-semibold">From</th>
                <th className="p-3 font-semibold">To</th>
                <th className="p-3 font-semibold">Amount</th>
                <th className="p-3 font-semibold">Type</th>
                <th className="p-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx, i) => (
                <tr
                  key={i}
                  className="border-t hover:bg-gray-50 transition-colors"
                >
                  <td className="p-3 text-gray-700">
                    {new Date(tx.createdAt).toLocaleString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="p-3 font-medium text-gray-800">
                    {tx.fromUser?.username || "N/A"}
                  </td>
                  <td className="p-3 font-medium text-gray-800">
                    {tx.toUser?.username || "N/A"}
                  </td>
                  <td className="p-3 text-gray-600">${tx.amount}</td>
                  <td className="p-3 font-semibold text-gray-900">{tx.type}</td>
                  <td className="p-3">
                    <span
                      className={`px-3 py-1 text-xs font-medium rounded-full ${
                        tx.status === "Completed"
                          ? "bg-green-100 text-green-700"
                          : tx.status === "Pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {tx.status || "N/A"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
