"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import toast from "react-hot-toast";

export default function PayToSponsorPage() {
  const [payments, setPayments] = useState([]);
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

    // ✅ PART 4: Lock sponsor's first sale when page loads
    const lockPayment = async () => {
      try {
        await fetch("/api/payment-lock", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: currentUserId,
            action: "lock",
          }),
        });
      } catch (err) {
        console.error("❌ Error locking payment:", err);
      }
    };

    lockPayment();

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
        console.log("✅ Payment Details:", detailsData);

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
            label: detailsData.sponsor.label,
            status: mapStatus(statusData.membershipStatus),
            paymentDetails: {
              name: detailsData.sponsor.name,
              receiverId: detailsData.sponsor.id,
              method: detailsData.sponsor.method,
              details: detailsData.sponsor.details,
            },
          },
        ];

        setPayments(paymentsData);
        // Auto-select the payment for the form
        setSelectedPayment(paymentsData[0]);
      } catch (err) {
        console.error("❌ Error fetching data:", err);
      } finally {
        setStatusLoading(false);
      }
    }

    fetchData();

    // ✅ PART 4: Unlock sponsor's first sale when component unmounts
    return () => {
      const unlockPayment = async () => {
        try {
          // Use sendBeacon for browser close/navigation away
          if (navigator.sendBeacon) {
            const data = JSON.stringify({
              userId: currentUserId,
              action: "unlock",
            });
            navigator.sendBeacon(
              "/api/payment-lock",
              new Blob([data], { type: "application/json" })
            );
          } else {
            // Fallback to fetch if sendBeacon not available
            fetch("/api/payment-lock", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                userId: currentUserId,
                action: "unlock",
              }),
              keepalive: true, // Keep request alive even after page unload
            }).catch(() => {
              // Ignore errors during cleanup
            });
          }
        } catch (err) {
          // Ignore errors during cleanup
        }
      };
      unlockPayment();
    };
  }, [currentUserId]);

  // ✅ PART 4: Handle browser close/tab close
  useEffect(() => {
    if (!currentUserId) return;

    const handleBeforeUnload = () => {
      // Unlock when browser/tab closes
      const data = JSON.stringify({
        userId: currentUserId,
        action: "unlock",
      });
      navigator.sendBeacon(
        "/api/payment-lock",
        new Blob([data], { type: "application/json" })
      );
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [currentUserId]);

  const mapStatus = (status) => {
    if (!status || status === "none") return "Unpaid";
    if (status === "pending") return "Pending";
    if (status === "completed") return "Paid";
    if (status === "rejected") return "Rejected";
    return "Unpaid";
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
      toast.error("Please upload screenshot and select payment method.");
      return;
    }

    setLoading(true);
    try {
      let imageUrl;
      try {
        imageUrl = await uploadImage(image);
      } catch (error) {
        toast.error("Failed to upload image. Please try again.");
        setLoading(false);
        return;
      }

      const res = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sender: currentUserId,
          receiver: selectedPayment.paymentDetails.receiverId,
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
        toast.success("Payment submitted successfully!");
        // Reset form
        setMethod("");
        setNote("");
        setImage(null);
      } else {
        toast.error(data.message || "Failed to submit payment.");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error submitting payment. Please try again.");
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
              {/* Expiration Notice */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-yellow-800 font-medium">
Make sure to upload your payment proof before closing this window; otherwise, the payment will not be accepted.<br/>
Please note:This data may change anytime, so avoid saving it and make your payment immediately.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Payment Details Section */}
                <div className="space-y-6">
                  <div className="bg-gray-50 rounded-xl p-6 border-2 border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Payment Information</h2>
                    
                    {payments.map((payment) => (
                      <div key={payment.id} className="space-y-4">
                        <div className="flex justify-between items-start">
                          <h3 className="text-lg font-bold text-gray-900">
                            {payment.title}
                          </h3>
                          <span className="text-2xl font-bold text-purple-600">
                            ${payment.amount}
                          </span>
                        </div>

                        <div className="bg-white rounded-lg p-4 border">
                          <h4 className="font-semibold text-gray-800 mb-3">
                            Payment Details
                          </h4>
                          <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Pay to:</span>
                              <span className="font-medium text-gray-900">
                                {payment.paymentDetails.name}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Method:</span>
                              <span className="font-medium text-gray-900">
                                {payment.paymentDetails.method}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Details:</span>
                              <span className="font-medium text-gray-900 break-all text-right ml-2">
                                {payment.paymentDetails.details}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Label:</span>
                              <span className="font-medium text-gray-900">
                                {payment.label}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-between items-center">
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
                    ))}
                  </div>
                </div>

                {/* Payment Form Section */}
                <div className="bg-gray-50 rounded-xl p-6 border-2 border-gray-100">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Submit Payment</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Payment Method Used
                      </label>
                      <input
                        type="text"
                        value={method}
                        onChange={(e) => setMethod(e.target.value)}
                        placeholder="e.g., Bank Transfer, PayPal, etc."
                        className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Upload Payment Proof (Screenshot)
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
                        Additional Notes (Optional)
                      </label>
                      <textarea
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder="Enter any additional details or reference numbers..."
                        rows="4"
                        className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 outline-none"
                      ></textarea>
                    </div>

                    <button
                      onClick={handleSubmitPayment}
                      disabled={loading || payments[0]?.status === "Pending" || payments[0]?.status === "Paid"}
                      className={`w-full py-3 rounded-lg font-semibold transition-all mt-4 ${
                        loading || payments[0]?.status === "Pending" || payments[0]?.status === "Paid"
                          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                          : "bg-purple-600 hover:bg-purple-700 text-white shadow-lg hover:shadow-xl"
                      }`}
                    >
                      {loading 
                        ? "Submitting Payment..." 
                        : payments[0]?.status === "Pending"
                        ? "⏳ Payment Pending"
                        : payments[0]?.status === "Paid"
                        ? "✅ Already Paid"
                        : "💰 Submit Payment"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}