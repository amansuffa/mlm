"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import toast from "react-hot-toast";
import { useTheme } from "next-themes";

export default function PayToSponsorPage() {
  const [payments, setPayments] = useState([]);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [method, setMethod] = useState("");
  const [note, setNote] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [statusLoading, setStatusLoading] = useState(true);
  const { theme } = useTheme();

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

  // Enhanced input handlers with focus effects
  const handleInputFocus = (e) => {
    e.target.style.borderColor = 'var(--accent)';
 
  };

  const handleInputBlur = (e) => {
    e.target.style.borderColor = 'var(--border)';
  };

  const handleTextareaFocus = (e) => {
    e.target.style.borderColor = 'var(--accent)';
  };

  const handleTextareaBlur = (e) => {
    e.target.style.borderColor = 'var(--border)';
  };

  const handleFileFocus = (e) => {
    e.target.style.borderColor = 'var(--accent)';
  };

  const handleFileBlur = (e) => {
    e.target.style.borderColor = 'var(--border)';
  };

  if (statusLoading) {
    return (
      <div className="min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="card rounded-xl shadow-lg p-12 text-center">
            <div 
              className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto"
              style={{ borderColor: 'var(--primary)' }}
            ></div>
            <p className="mt-4 text-lg opacity-80">Checking payment status...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="header rounded-2xl shadow-xl overflow-hidden">
            <div className="px-8 py-8">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                <div className="mb-6 lg:mb-0">
                  <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">
                    Pay to Sponsor
                  </h1>
                  <p className="text-white text-opacity-90 text-lg">
                    Complete your membership payment to your sponsor
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-xl text-white">
                    <p className="text-sm opacity-90">Amount Due</p>
                    <p className="text-2xl font-bold">
                      ${payments[0]?.amount || "0"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {session?.user?.status === "fully_active" ? (
          <div 
            className="rounded-xl shadow-lg p-12 text-center"
            style={{ 
              backgroundColor: 'var(--card)',
              border: `1px solid var(--border)`
            }}
          >
            <div 
              className="w-24 h-24 rounded-full flex bg-[var(--primary)]/20 items-center justify-center mx-auto mb-4"

            >
              <svg
                className="w-12 h-12"
                style={{ color: 'var(--primary)' }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--text)' }}>
              Membership Already Active
            </h3>
            <p className="mb-6 opacity-80">
              Your membership payment has been processed and your account is fully active.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Warning Notice */}
            <div 
              className="rounded-xl shadow-lg p-6"
              style={{ 
                backgroundColor: 'var(--card)',
                border: `1px solid var(--border)`
              }}
            >
              <div className="flex items-start space-x-4">
                <div 
                  className="p-3 rounded-lg bg-[var(--accent)]/20 flex items-center justify-center"
       
                >
                  <svg 
                    className="w-6 h-6" 
                    style={{ color: 'var(--accent)' }}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold mb-2" style={{ color: 'var(--text)' }}>
                    Important Payment Instructions
                  </h4>
                  <p className="text-sm opacity-80 leading-relaxed">
                    Make sure to upload your payment proof before closing this window; otherwise, the payment will not be accepted.<br/>
                    Please note: This data may change anytime, so avoid saving it and make your payment immediately.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Payment Details Section */}
              <div 
                className="rounded-xl shadow-lg p-6"
                style={{ 
                  backgroundColor: 'var(--card)',
                  border: `1px solid var(--border)`
                }}
              >
                <h2 className="text-xl font-semibold mb-6" style={{ color: 'var(--text)' }}>
                  Payment Information
                </h2>
                
                {payments.map((payment) => (
                  <div key={payment.id} className="space-y-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-bold" style={{ color: 'var(--text)' }}>
                          {payment.title}
                        </h3>
                        <p className="text-sm opacity-70 mt-1">Membership Fee</p>
                      </div>
                      <span className="text-2xl font-bold text-green-600">
                        ${payment.amount}
                      </span>
                    </div>

                    <div 
                      className="rounded-xl p-4"
                      style={{ backgroundColor: 'var(--cardSecondary)' }}
                    >
                      <h4 className="font-semibold mb-3" style={{ color: 'var(--text)' }}>
                        Payment Details
                      </h4>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center py-2 border-b" style={{ borderColor: 'var(--border)' }}>
                          <span className="text-sm opacity-80">Pay to:</span>
                          <span className="font-medium" style={{ color: 'var(--text)' }}>
                            {payment.paymentDetails.name}
                          </span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b" style={{ borderColor: 'var(--border)' }}>
                          <span className="text-sm opacity-80">Method:</span>
                          <span className="font-medium" style={{ color: 'var(--text)' }}>
                            {payment.paymentDetails.method}
                          </span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b" style={{ borderColor: 'var(--border)' }}>
                          <span className="text-sm opacity-80">Details:</span>
                          <span className="font-medium text-right break-all" style={{ color: 'var(--text)' }}>
                            {payment.paymentDetails.details}
                          </span>
                        </div>
                        <div className="flex justify-between items-center py-2">
                          <span className="text-sm opacity-80">Label:</span>
                          <span className="font-medium" style={{ color: 'var(--text)' }}>
                            {payment.label}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
                      <span className="text-sm font-medium opacity-80">
                        Current Status:
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          payment.status === "Pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : payment.status === "Paid"
                            ? "bg-green-100 text-green-700"
                            : payment.status === "Rejected"
                            ? "bg-red-100 text-red-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {payment.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Payment Form Section */}
              <div 
                className="rounded-xl shadow-lg p-6"
                style={{ 
                  backgroundColor: 'var(--card)',
                  border: `1px solid var(--border)`
                }}
              >
                <h2 className="text-xl font-semibold mb-6" style={{ color: 'var(--text)' }}>
                  Submit Payment
                </h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2 opacity-80">
                      Payment Method Used
                    </label>
                    <input
                      type="text"
                      value={method}
                      onChange={(e) => setMethod(e.target.value)}
                      onFocus={handleInputFocus}
                      onBlur={handleInputBlur}
                      placeholder="e.g., Bank Transfer, PayPal, etc."
                      className="w-full rounded-xl px-4 py-3 focus:outline-none focus:ring-1 transition-all duration-300"
                      style={{ 
                        backgroundColor: `var(--cardSecondary)`,
                        border: `2px solid var(--border)`,
                        color: 'var(--text)', '--tw-ring-color': 'var(--accent)'
                      }}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 opacity-80">
                      Upload Payment Proof (Screenshot)
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setImage(e.target.files[0])}
                      onFocus={handleFileFocus}
                      onBlur={handleFileBlur}
                      className="w-full rounded-xl px-4 py-3 focus:outline-none focus:ring-1 transition-all duration-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold"
                      style={{ 
                        backgroundColor: `var(--cardSecondary)`,
                        border: `2px solid var(--border)`,
                        color: 'var(--text)', '--tw-ring-color': 'var(--accent)'
                      }}
                    />
                    {image && (
                      <p className="text-sm text-green-600 mt-2">
                        ✓ {image.name} selected
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 opacity-80">
                      Additional Notes (Optional)
                    </label>
                    <textarea
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      onFocus={handleTextareaFocus}
                      onBlur={handleTextareaBlur}
                      placeholder="Enter any additional details or reference numbers..."
                      rows="4"
                      className="w-full rounded-xl px-4 py-3 focus:outline-none focus:ring-1 transition-all duration-300 resize-vertical"
                      style={{ 
                        backgroundColor: `var(--cardSecondary)`,
                        border: `2px solid var(--border)`,
                        color: 'var(--text)', '--tw-ring-color': 'var(--accent)'
                      }}
                    />
                  </div>

                  <button
                    onClick={handleSubmitPayment}
                    disabled={loading || payments[0]?.status === "Pending" || payments[0]?.status === "Paid"}
                    className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2 ${
                      loading || payments[0]?.status === "Pending" || payments[0]?.status === "Paid"
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:shadow-xl"
                    }`}
                    style={{ 
                      background: `linear-gradient(135deg, var(--primary), var(--secondary))`,
                      color: 'white'
                    }}
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>Submitting Payment...</span>
                      </>
                    ) : payments[0]?.status === "Pending" ? (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Payment Pending</span>
                      </>
                    ) : payments[0]?.status === "Paid" ? (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Already Paid</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                        </svg>
                        <span>Submit Payment</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}