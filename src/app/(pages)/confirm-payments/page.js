"use client";
import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function ConfirmPaymentsPage() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();
  const router = useRouter();

  const fetchPendingTransactions = useCallback(async () => {
    if (!session?.user?.id) return;
    
    setLoading(true);
    try {
      const res = await fetch(`/api/transactions/pending?userId=${session.user.id}`);
      const data = await res.json();
      
      if (data.error) {
        console.error('API Error:', data.error);
        setTransactions([]);
      } else {
        setTransactions(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error('Fetch error:', error);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  }, [session?.user?.id]);

  useEffect(() => {
    if (session?.user?.id) {
      fetchPendingTransactions();
    }
  }, [session?.user?.id, fetchPendingTransactions]);



  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
            <h1 className="text-3xl font-bold text-white">⏳ Pending Payments</h1>
            <p className="text-blue-100 mt-2">Review and approve pending transactions</p>
          </div>

          <div className="p-8">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">Loading Transactions...</h3>
                <p className="text-gray-500">Please wait while we fetch pending transactions</p>
              </div>
            ) : !transactions || transactions.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🎉</div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No Pending Transactions</h3>
                <p className="text-gray-500">All transactions have been processed</p>
              </div>
            ) : (
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
                    {transactions?.map((tx) => (
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
                          <span className="px-4 py-2 text-xs font-bold rounded-full bg-yellow-100 text-yellow-800">
                            PENDING
                          </span>
                        </td>
                        <td className="p-4">
                          <button
                            onClick={() => router.push(`/transactions/${tx._id}?from=confirm-payments`)}
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
}