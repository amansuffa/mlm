"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

export default function PayToSponsorPage() {
  const [payments, setPayments] = useState([
    {
      id: 1,
      title: "Admin Payment",
      amount: 50,
      type: "admin",
      status: "Unpaid",
      details: {
        name: "Admin: Muhammad Ali",
        receiverId: "68dfa192ad8eb3e6451b9274", // Admin _id
        method: "Bank Transfer",
        accountNumber: "1234-5678-91011",
        bankName: "Habib Bank Limited (HBL)",
      },
    },
    {
      id: 2,
      title: "Membership Payment",
      amount: 500,
      type: "membership",
      status: "Unpaid",
      details: {
        name: "Sponsor: Sara Ahmed",
        receiverId: "68dfa192ad8eb3e6451b9276", // Sponsor _id
        method: "JazzCash / EasyPaisa",
        accountNumber: "0300-1234567",
        bankName: "Mobile Account",
      },
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [method, setMethod] = useState("");
  const [note, setNote] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [statusLoading, setStatusLoading] = useState(true); // ✅ loader for status check

  const { data: session } = useSession();
  const currentUserId = session?.user?.id;

  useEffect(() => {
    if (!currentUserId) return;

    async function fetchStatus() {
      setStatusLoading(true);
      try {
        const res = await fetch("/api/transactions/status", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: currentUserId }),
        });

        if (!res.ok) throw new Error("Failed to fetch payment status");

        const data = await res.json();
        console.log("✅ Status response:", data);

        if (data) {
          setPayments((prev) =>
            prev.map((p) => {
              if (p.type === "admin") return { ...p, status: mapStatus(data.adminStatus) };
              if (p.type === "membership") return { ...p, status: mapStatus(data.membershipStatus) };
              return p;
            })
          );
        }
      } catch (err) {
        console.error("❌ Error fetching status:", err);
      } finally {
        setStatusLoading(false);
      }
    }

    fetchStatus();
  }, [currentUserId]);

  const mapStatus = (status) => {
    if (!status || status === "none") return "Unpaid";
    if (status === "pending") return "Pending";
    if (status === "completed") return "Paid";
    if (status === "rejected") return "Rejected";
    return "Unpaid";
  };

  const handlePayNow = (payment) => {
    setSelectedPayment(payment);
    setIsModalOpen(true);
  };

  const uploadImage = async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'ml_default'); // if you're using Cloudinary

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to upload image');
      }

      const data = await res.json();
      return data.url;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw new Error('Image upload failed');
    }
  };

  const handleSubmitPayment = async () => {
    if (!method || !image) {
      alert("Please upload screenshot and select payment method.");
      return;
    }

    setLoading(true);
    try {
      let imageUrl;
      try {
        imageUrl = await uploadImage(image);
      } catch (error) {
        alert("Failed to upload image. Please try again.");
        setLoading(false);
        return;
      }

      const res = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sender: currentUserId,
          receiver: selectedPayment.details.receiverId,
          amount: selectedPayment.amount,
          type: selectedPayment.type,
          method,
          note,
          image: imageUrl,
        }),
      });

      const data = await res.json();
      
      if (data.success) {
        setPayments((prev) =>
          prev.map((p) =>
            p.id === selectedPayment.id ? { ...p, status: "Pending" } : p
          )
        );
        setIsModalOpen(false);
        alert("✅ Payment submitted successfully!");
      } else {
        alert("❌ " + (data.message || "Failed to submit payment."));
      }
    } catch (error) {
      console.error('Error:', error);
      alert("Error submitting payment. Please try again.");
    } finally {
      setLoading(false);
    }
  };


  if (statusLoading) {
    // ✅ Loader while checking status
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-purple-500 border-dashed rounded-full animate-spin mb-4"></div>
          <p className="text-gray-700 font-medium">Checking payment status...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">
          Pay to Sponsor / Admin
        </h1>
        <p className="text-gray-600 mb-8 text-center">
          Complete your payments securely to continue your membership.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {payments.map((payment) => (
            <div
              key={payment.id}
              className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-all flex flex-col justify-between"
            >
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">
                  {payment.title}
                </h3>
                <p className="text-gray-600 mb-4">
                  Pay to:{" "}
                  <span className="font-semibold text-gray-800">{payment.details.name}</span>
                </p>

                <div className="text-sm space-y-1 mb-4">
                  <p>
                    <span className="font-medium">Payment Method:</span> {payment.details.method}
                  </p>
                  <p>
                    <span className="font-medium">Account Number:</span> {payment.details.accountNumber}
                  </p>
                  <p>
                    <span className="font-medium">Bank / Service:</span> {payment.details.bankName}
                  </p>
                </div>

                <div className="flex justify-between items-center mb-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      payment.status === "Pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : payment.status === "Paid"
                        ? "bg-green-100 text-green-800"
                        : payment.status === "Rejected"
                        ? "bg-red-200 text-red-900"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {payment.status}
                  </span>
                  <span className="text-2xl font-bold text-[#6E11B0]">${payment.amount}</span>
                </div>
              </div>

              <button
                disabled={payment.status === "Pending" || payment.status === "Paid"}
                onClick={() => handlePayNow(payment)}
                className={`w-full py-2 rounded-lg text-white font-medium transition-colors duration-200 ${
                  payment.status === "Pending" || payment.status === "Paid"
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-[#8200DB] hover:bg-[#6E11B0]"
                }`}
              >
                {payment.status === "Pending"
                  ? "Payment Pending"
                  : payment.status === "Paid"
                  ? "Already Paid"
                  : "Pay Now"}
              </button>
            </div>
          ))}
        </div>

        {isModalOpen && selectedPayment && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 relative">
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
              >
                ✕
              </button>

              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Submit Payment for {selectedPayment.title}
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Payment Method
                  </label>
                  <input
                    type="text"
                    value={method}
                    onChange={(e) => setMethod(e.target.value)}
                    placeholder="e.g. JazzCash, Bank, Easypaisa"
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Upload Screenshot
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImage(e.target.files[0])}
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Additional Notes
                  </label>
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Enter any details (optional)"
                    rows="3"
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 outline-none"
                  ></textarea>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitPayment}
                  disabled={loading}
                  className="px-4 py-2 bg-[#8200DB] hover:bg-[#6E11B0] text-white rounded-lg"
                >
                  {loading ? "Submitting..." : "Submit Payment"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
