"use client";
import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { useTheme } from "next-themes";

export default function TransactionDetailsPage() {
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imageOpen, setImageOpen] = useState(false);
  const { id } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const { theme } = useTheme();
  
  const from = searchParams.get('from');

  const fetchTransaction = useCallback(async () => {
    try {
      const res = await fetch(`/api/transactions/${id}`);
      const data = await res.json();
      setTransaction(data);
    } catch (error) {
      console.error("Failed to fetch transaction:", error);
      toast.error("Failed to load transaction details");
    }
  }, [id]);

  useEffect(() => {
    fetchTransaction();
  }, [fetchTransaction]);

  const handleAction = async (action) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/transactions/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      const data = await res.json();

      if (data.success) {
        toast.success(`Transaction ${action}ed successfully`);
        if (from === 'confirm-payments') {
          router.push('/confirm-payments');
        } else {
          router.push('/transactions');
        }
      } else {
        toast.error(data.error || "Failed to update transaction");
      }
    } catch (error) {
      toast.error("Failed to update transaction");
    } finally {
      setLoading(false);
    }
  };

  const getStatusInfo = (status) => {
    switch (status) {
      case "completed":
        return { text: "Completed", class: "bg-green-100 text-green-700", color: "text-green-600" };
      case "pending":
        return { text: "Pending", class: "bg-yellow-100 text-yellow-700", color: "text-yellow-600" };
      case "rejected":
        return { text: "Rejected", class: "bg-red-100 text-red-700", color: "text-red-600" };
      default:
        return { text: "Pending", class: "bg-yellow-100 text-yellow-700", color: "text-yellow-600" };
    }
  };

  const getTypeInfo = (type) => {
    switch (type) {
      case "admin":
        return { text: "Admin Fee", class: "bg-blue-100 text-blue-700" };
      case "membership":
        return { text: "Membership Fee", class: "bg-purple-100 text-purple-700" };
      default:
        return { text: "Other", class: "bg-gray-100 text-gray-700" };
    }
  };

  if (!transaction) {
    return (
      <div className="min-h-screen py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="card rounded-xl shadow-lg p-12 text-center">
            <div 
              className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto"
              style={{ borderColor: 'var(--primary)' }}
            ></div>
            <p className="mt-4 text-lg opacity-80">Loading transaction details...</p>
          </div>
        </div>
      </div>
    );
  }

  const statusInfo = getStatusInfo(transaction.status);
  const typeInfo = getTypeInfo(transaction.type);

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => {
            if (from === 'confirm-payments') {
              router.push('/confirm-payments');
            } else {
              router.push('/transactions');
            }
          }}
          className="mb-6 flex items-center space-x-2 font-medium transition-all duration-200 hover:opacity-70"
          style={{ color: 'var(--primary)' }}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>Back to {from === 'confirm-payments' ? 'Confirm Payments' : 'Transactions'}</span>
        </button>

        {/* Header Section */}
        <div className="mb-8">
          <div className="header rounded-2xl shadow-xl overflow-hidden">
            <div className="px-8 py-8">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                <div className="mb-6 lg:mb-0">
                  <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">
                    Transaction Details
                  </h1>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-xl text-white">
                    <p className="text-sm opacity-90">Amount</p>
                    <p className="text-2xl font-bold">${transaction.amount}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6" style={{ gridTemplateRows: 'auto auto' }}>
          {/* Transaction Information Card */}
          <div 
            className="rounded-xl shadow-lg p-6"
            style={{ 
              backgroundColor: 'var(--card)',
              border: `1px solid var(--border)`
            }}
          >
              <h3 className="text-xl font-semibold mb-4" style={{ color: 'var(--text)' }}>
                Transaction Information
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b" style={{ borderColor: 'var(--border)' }}>
                  <span className="font-medium opacity-80">From User</span>
                  <span className="font-semibold" style={{ color: 'var(--text)' }}>
                    {transaction.fromUser?.username || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b" style={{ borderColor: 'var(--border)' }}>
                  <span className="font-medium opacity-80">To User</span>
                  <span className="font-semibold" style={{ color: 'var(--text)' }}>
                    {transaction.toUser?.username || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b" style={{ borderColor: 'var(--border)' }}>
                  <span className="font-medium opacity-80">Transaction Type</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${typeInfo.class}`}>
                    {typeInfo.text}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b" style={{ borderColor: 'var(--border)' }}>
                  <span className="font-medium opacity-80">Status</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusInfo.class}`}>
                    {statusInfo.text}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="font-medium opacity-80">Date & Time</span>
                  <span className="font-semibold" style={{ color: 'var(--text)' }}>
                    {new Date(transaction.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

          {/* Payment Proof Card */}
          {transaction.image ? (
            <div 
              className="rounded-xl shadow-lg p-6"
              style={{ 
                backgroundColor: 'var(--card)',
                border: `1px solid var(--border)`
              }}
            >
              <h3 className="text-xl font-semibold mb-4" style={{ color: 'var(--text)' }}>
                Payment Proof
              </h3>
              <div className="space-y-4">
                <Image
                  src={transaction.image}
                  alt="Payment proof"
                  width={400}
                  height={256}
                  className="w-full h-64 object-cover rounded-lg border cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => setImageOpen(true)}
                />
                <p className="text-sm opacity-70 text-center">Click image to view full size</p>
              </div>
            </div>
          ) : (
            <div 
              className="rounded-xl shadow-lg p-6"
              style={{ 
                backgroundColor: 'var(--card)',
                border: `1px solid var(--border)`
              }}
            >
              <h3 className="text-xl font-semibold mb-4" style={{ color: 'var(--text)' }}>
                Payment Proof
              </h3>
              <div className="text-center py-8">
                <svg className="w-16 h-16 mx-auto opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 002 2z" />
                </svg>
                <p className="mt-4 opacity-70">No payment proof uploaded</p>
              </div>
            </div>
          )}

          {/* Payment Details Card */}
          <div 
            className="rounded-xl shadow-lg p-6"
            style={{ 
              backgroundColor: 'var(--card)',
              border: `1px solid var(--border)`
            }}
          >
              <h3 className="text-xl font-semibold mb-4" style={{ color: 'var(--text)' }}>
                Payment Details
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b" style={{ borderColor: 'var(--border)' }}>
                  <span className="font-medium opacity-80">Payment Method</span>
                  <span className="font-semibold" style={{ color: 'var(--text)' }}>
                    {transaction.method || "Not specified"}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="font-medium opacity-80">Additional Notes</span>
                  <span className="font-semibold text-right max-w-xs" style={{ color: 'var(--text)' }}>
                    {transaction.note || "No additional notes"}
                  </span>
                </div>
              </div>
            </div>

          {/* Admin Actions Card */}
          {transaction.status === "pending" && session?.user?.role === "admin" ? (
            <div 
              className="rounded-xl shadow-lg p-6"
              style={{ 
                backgroundColor: 'var(--card)',
                border: `1px solid var(--border)`
              }}
            >
                <h3 className="text-xl font-semibold mb-4" style={{ color: 'var(--text)' }}>
                  Admin Actions
                </h3>
                <div className="space-y-3">
                  <button
                    onClick={() => handleAction("approve")}
                    disabled={loading}
                    className="w-full px-6 py-3 bg-green-500 text-white font-semibold rounded-xl hover:bg-green-600 disabled:opacity-50 transition-all duration-300 flex items-center justify-center space-x-2"
                  >
                    {loading ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                    <span>{loading ? "Processing..." : "Approve Transaction"}</span>
                  </button>
                  <button
                    onClick={() => handleAction("reject")}
                    disabled={loading}
                    className="w-full px-6 py-3 bg-red-500 text-white font-semibold rounded-xl hover:bg-red-600 disabled:opacity-50 transition-all duration-300 flex items-center justify-center space-x-2"
                  >
                    {loading ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    )}
                    <span>{loading ? "Processing..." : "Reject Transaction"}</span>
                  </button>
                </div>
              </div>
            ) : (
              <div></div>
            )}
        </div>
      </div>

      {/* Image Modal */}
      {imageOpen && transaction.image && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
          onClick={() => setImageOpen(false)}
        >
          <div className="relative max-w-full max-h-full">
            <Image
              src={transaction.image}
              alt="Payment proof"
              width={800}
              height={600}
              className="max-w-full max-h-full object-contain rounded-lg"
            />
            <button
              onClick={() => setImageOpen(false)}
              className="absolute top-4 right-4 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-full transition-all"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}