"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function TransactionDetailsPage() {
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imageOpen, setImageOpen] = useState(false);
  const { id } = useParams();
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    fetchTransaction();
  }, [id]);

  const fetchTransaction = async () => {
    const res = await fetch(`/api/transactions/${id}`);
    const data = await res.json();
    setTransaction(data);
  };

  const handleAction = async (action) => {
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
      await fetchTransaction(); // Refresh transaction data
    } else {
      alert("Failed to update transaction");
    }
  };

  const canAct = () => {
    if (!transaction || !session) return false;
    if (transaction.type === "admin" && session.user?.role === "admin") return true;
    if (transaction.type === "membership" && session.user?.id === transaction.toUser?._id) return true;
    return false;
  };

  if (!transaction) return <div className="p-6">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => router.push('/transactions')}
          className="mb-6 flex items-center text-blue-600 hover:text-blue-800 font-medium"
        >
          ← Back to Transactions
        </button>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
            <h1 className="text-3xl font-bold text-white">Transaction Details</h1>
            <p className="text-blue-100 mt-2">Transaction ID: {transaction._id}</p>
          </div>

          <div className="p-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="bg-gray-50 p-4 rounded-xl">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Transaction Info</h3>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-600">From User</label>
                      <p className="text-lg font-semibold text-gray-900">{transaction.fromUser?.username || "N/A"}</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-600">To User</label>
                      <p className="text-lg font-semibold text-gray-900">{transaction.toUser?.username || "N/A"}</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-600">Amount</label>
                      <p className="text-2xl font-bold text-green-600">${transaction.amount}</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-600">Type</label>
                      <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium capitalize">
                        {transaction.type} Fee
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-xl">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Payment Details</h3>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-600">Payment Method</label>
                      <p className="text-lg text-gray-900">{transaction.method || "Not specified"}</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-600">Note</label>
                      <p className="text-lg text-gray-900">{transaction.note || "No additional notes"}</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-600">Date & Time</label>
                      <p className="text-lg text-gray-900">{new Date(transaction.createdAt).toLocaleString()}</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-600">Status</label>
                      <span
                        className={`inline-block px-4 py-2 rounded-full text-sm font-bold ${
                          transaction.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : transaction.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {transaction.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                {transaction.image ? (
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Payment Proof</h3>
                    <img
                      src={transaction.image}
                      alt="Payment proof"
                      className="w-full h-64 object-cover rounded-lg border cursor-pointer hover:opacity-80"
                      onClick={() => setImageOpen(true)}
                    />
                    <p className="text-sm text-gray-500 mt-2">Click image to view full size</p>
                  </div>
                ) : (
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Payment Proof</h3>
                    <p className="text-gray-500">No payment proof uploaded</p>
                  </div>
                )}

                {transaction.status === "pending" && canAct() && (
                  <div className="bg-gray-50 p-6 rounded-xl">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Actions</h3>
                    <div className="space-y-3">
                      <button
                        onClick={() => handleAction("approve")}
                        disabled={loading}
                        className="w-full px-6 py-3 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 disabled:opacity-50 transition-colors"
                      >
                        {loading ? "Processing..." : "✓ Approve Transaction"}
                      </button>
                      <button
                        onClick={() => handleAction("reject")}
                        disabled={loading}
                        className="w-full px-6 py-3 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 disabled:opacity-50 transition-colors"
                      >
                        {loading ? "Processing..." : "✗ Reject Transaction"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {imageOpen && transaction.image && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
          onClick={() => setImageOpen(false)}
        >
          <div className="relative max-w-full max-h-full">
            <img
              src={transaction.image}
              alt="Payment proof"
              className="max-w-full max-h-full object-contain rounded-lg"
            />
            <button
              onClick={() => setImageOpen(false)}
              className="absolute top-4 right-4 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-full transition-all"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}