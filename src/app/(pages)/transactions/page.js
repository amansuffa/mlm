"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();
  const currentUserId = session?.user?.id;
  const currentUserRole = session?.user?.role;
  const router = useRouter();

  async function fetchData() {
    const res = await fetch("/api/transactions");
    const data = await res.json();
    setTransactions(data);
  }

  useEffect(() => {
    fetchData();
  }, []);

  const handleAction = async (id, action) => {
    setLoading(true);
    const res = await fetch(`/api/transactions/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    });
    const data = await res.json();
    setLoading(false);

    if (data.success) {
      alert(`Transaction ${action}ed successfully`);
      fetchData();
    } else {
      alert("Failed to update transaction");
    }
  };

  const canAct = (tx) => {
    if (tx.type === "admin" && currentUserRole === "admin") return true;
    if (tx.type === "membership" && currentUserId === tx.toUser?._id) return true;
    return false;
  };

  const canViewDetails = (tx) => {
    if (tx.type === "admin" && currentUserRole === "admin") return true;
    if (tx.type === "membership" && currentUserId === tx.toUser?._id) return true;
    return false;
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
            <h1 className="text-3xl font-bold text-white">💳 Transactions</h1>
            <p className="text-blue-100 mt-2">View and manage all transactions</p>
          </div>

          <div className="p-8">
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse min-w-[800px]">
                <thead>
                  <tr className="bg-gray-50 text-gray-700">
                    <th className="p-4 text-left font-semibold">Date</th>
                    <th className="p-4 text-left font-semibold">From</th>
                    <th className="p-4 text-left font-semibold">To</th>
                    <th className="p-4 text-left font-semibold">Amount</th>
                    <th className="p-4 text-left font-semibold">Type</th>
                    <th className="p-4 text-left font-semibold">Status</th>
                    <th className="p-4 text-left font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx) => (
                    <tr key={tx._id} className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="p-4">
                        <div className="text-gray-900 font-medium">
                          {new Date(tx.createdAt).toLocaleDateString()}
                        </div>
                        <div className="text-gray-500 text-xs">
                          {new Date(tx.createdAt).toLocaleTimeString()}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="font-medium text-gray-900">{tx.fromUser?.username || "N/A"}</div>
                      </td>
                      <td className="p-4">
                        <div className="font-medium text-gray-900">{tx.toUser?.username || "N/A"}</div>
                      </td>
                      <td className="p-4">
                        <div className="text-lg font-bold text-green-600">${tx.amount}</div>
                      </td>
                      <td className="p-4">
                        <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium capitalize">
                          {tx.type} Fee
                        </span>
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-4 py-2 text-xs font-bold rounded-full ${
                            tx.status === "completed"
                              ? "bg-green-100 text-green-800"
                              : tx.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {tx.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() => router.push(`/transactions/${tx._id}`)}
                          className="px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
