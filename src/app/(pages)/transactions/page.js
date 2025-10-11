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
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-700 mb-6">💳 Transactions</h2>

      <div className="bg-white p-6 rounded-2xl shadow-lg overflow-x-auto">
        <table className="w-full text-sm border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-gray-100 text-gray-600 text-left">
              <th className="p-3">Date</th>
              <th className="p-3">From</th>
              <th className="p-3">To</th>
              <th className="p-3">Amount</th>
              <th className="p-3">Type</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr key={tx._id} className="border-t hover:bg-gray-50">
                <td className="p-3">
                  {new Date(tx.createdAt).toLocaleString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </td>
                <td className="p-3">{tx.fromUser?.username || "N/A"}</td>
                <td className="p-3">{tx.toUser?.username || "N/A"}</td>
                <td className="p-3">${tx.amount}</td>
                <td className="p-3 capitalize">{tx.type}</td>
                <td className="p-3">
                  <span
                    className={`px-3 py-1 text-xs font-medium rounded-full ${
                      tx.status === "completed"
                        ? "bg-green-100 text-green-700"
                        : tx.status === "pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {tx.status}
                  </span>
                </td>
                <td className="p-3">
                  {tx.status === "pending" && canViewDetails(tx) && (
                    <button
                      onClick={() => router.push(`/transactions/${tx._id}`)}
                      className="px-3 py-1 bg-blue-500 text-white text-xs rounded-lg hover:bg-blue-600"
                    >
                      View Details
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
