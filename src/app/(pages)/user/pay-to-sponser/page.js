"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";

export default function PayToSponsorPage() {
  const [payments, setPayments] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [method, setMethod] = useState("");
  const [note, setNote] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [statusLoading, setStatusLoading] = useState(true);

  const { data: session } = useSession();
  const currentUserId = session?.user?.id;

  useEffect(() => {
    if (!currentUserId) return;

    async function fetchData() {
      setStatusLoading(true);
      try {
        // Fetch payment details
        const detailsRes = await fetch("/api/payment-details", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: currentUserId }),
        });

        if (!detailsRes.ok) throw new Error("Failed to fetch payment details");
        const detailsData = await detailsRes.json();

        // Fetch payment status
        const statusRes = await fetch("/api/transactions/status", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: currentUserId }),
        });

        if (!statusRes.ok) throw new Error("Failed to fetch payment status");
        const statusData = await statusRes.json();

        // Create payments array with only membership payment
        const paymentsData = [
          {
            id: 1,
            title: "Membership Payment",
            amount: detailsData.sponsor.amount,
            type: "membership",
            status: mapStatus(statusData.membershipStatus),
            details: {
              name: detailsData.sponsor.name,
              receiverId: detailsData.sponsor.id,
              method: detailsData.sponsor.method,
              accountNumber: detailsData.sponsor.accountNumber,
              bankName: detailsData.sponsor.bankName,
            },
          },
        ];

        setPayments(paymentsData);
      } catch (err) {
        console.error("❌ Error fetching data:", err);
      } finally {
        setStatusLoading(false);
      }
    }

    fetchData();
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

 const uploadImage = async (file, folder = "payment-proof") => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);

    const res = await axios.post("/api/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
      timeout: 120000,
    });

    console.log("✅ Cloudinary Upload Response:", res.data);

    return res.data.url; 
  } catch (error) {
    console.error("❌ Error uploading image:", error.response?.data || error.message);
    throw new Error("Image upload failed");
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
          name: session?.user?.name,
          email: session?.user?.email,
          username: session?.user?.username,
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
      console.error("Error:", error);
      alert("Error submitting payment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (statusLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-700 font-medium">
            Checking payment status...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6">
            <h1 className="text-3xl font-bold text-white">💳 Pay to Sponsor</h1>
            <p className="text-purple-100 mt-2">
              Complete your membership payment to your sponsor
            </p>
          </div>
          {session.user.status == "fully_active" ? (
            <div className="py-8">
              <div className="flex justify-center items-center h-30">
                <h3 className="text-2xl font-bold text-gray-900">
                  Already paid
                </h3>
              </div>
            </div>
          ) : (
            <div className="p-8">
              <div className="flex justify-center">
                <div className="w-full max-w-lg">
                  {payments.map((payment) => (
                    <div
                      key={payment.id}
                      className="bg-gray-50 rounded-xl p-6 border-2 border-gray-100 hover:border-purple-200 transition-all"
                    >
                      <div className="mb-6">
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="text-2xl font-bold text-gray-900">
                            {payment.title}
                          </h3>
                          <span className="text-3xl font-bold text-purple-600">
                            ${payment.amount}
                          </span>
                        </div>

                        <div className="bg-white rounded-lg p-4 mb-4">
                          <h4 className="font-semibold text-gray-800 mb-3">
                            Payment Details
                          </h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Pay to:</span>
                              <span className="font-medium text-gray-900">
                                {payment.details.name}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Method:</span>
                              <span className="font-medium text-gray-900">
                                {payment.details.method}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Account:</span>
                              <span className="font-medium text-gray-900">
                                {payment.details.accountNumber}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Bank:</span>
                              <span className="font-medium text-gray-900">
                                {payment.details.bankName}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-between items-center mb-6">
                          <span className="text-sm font-medium text-gray-600">
                            Status:
                          </span>
                          <span
                            className={`px-4 py-2 rounded-full text-sm font-bold ${
                              payment.status === "Pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : payment.status === "Paid"
                                ? "bg-green-100 text-green-800"
                                : payment.status === "Rejected"
                                ? "bg-red-100 text-red-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {payment.status.toUpperCase()}
                          </span>
                        </div>
                      </div>

                      <button
                        disabled={
                          payment.status === "Pending" ||
                          payment.status === "Paid"
                        }
                        onClick={() => handlePayNow(payment)}
                        className={`w-full py-3 rounded-lg font-semibold transition-all ${
                          payment.status === "Pending" ||
                          payment.status === "Paid"
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                            : "bg-purple-600 hover:bg-purple-700 text-white shadow-lg hover:shadow-xl"
                        }`}
                      >
                        {payment.status === "Pending"
                          ? "⏳ Payment Pending"
                          : payment.status === "Paid"
                          ? "✅ Already Paid"
                          : "💰 Pay Now"}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
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
  );
}
