"use client";
import { useState, Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import axios from "axios";
import toast from "react-hot-toast";
import { useTheme } from "next-themes";

function PaymentForm() {
  const router = useRouter();
  const [selectedMethod, setSelectedMethod] = useState("crypto");
  const [selectedCrypto, setSelectedCrypto] = useState("");
  const [loading, setLoading] = useState(false);
  const [paymentProof, setPaymentProof] = useState(null);
  const [proofPreview, setProofPreview] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [adminFeeStatus, setAdminFeeStatus] = useState(null);
  const [checkingStatus, setCheckingStatus] = useState(true);
  const [formData, setFormData] = useState({
    completeName: "",
    registeredEmail: "",
    wiseAccountEmail: "",
    pashClubUsername: "",
    transactionId: "",
    additionalDetails: "",
  });

  const adminFeeAmount = 50;
  const searchParams = useSearchParams();
  const userId = searchParams.get("uid");
  const { theme } = useTheme();

  // Check existing admin fee transaction status
  useEffect(() => {
    const checkAdminFeeStatus = async () => {
      if (!userId) return;
      
      try {
        const res = await fetch(`/api/transactions?userId=${userId}&type=admin`);
        const data = await res.json();
        
        if (data && data.length > 0) {
          const adminTransaction = data.find(tx => tx.type === 'admin');
          if (adminTransaction) {
            setAdminFeeStatus(adminTransaction.status);
          }
        }
      } catch (error) {
        console.error('Error checking admin fee status:', error);
      } finally {
        setCheckingStatus(false);
      }
    };

    checkAdminFeeStatus();
  }, [userId]);

  const cryptoOptions = [
    {
      value: "usdtbsc",
      label: "USDT (BSC)",
      icon: "💲",
    },
  ];

  // Check if payment method is properly selected
  const isPaymentReady = () => {
    if (selectedMethod === "crypto") {
      return selectedCrypto !== "";
    } else if (selectedMethod === "manual") {
      const requiredFields = [
        formData.completeName,
        formData.registeredEmail,
        formData.pashClubUsername,
      ];
      return (
        paymentProof !== null &&
        requiredFields.every((field) => field.trim() !== "")
      );
    }
    return false;
  };

  const handlePaymentProof = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPaymentProof(file);
      const previewUrl = URL.createObjectURL(file);
      setProofPreview(previewUrl);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (adminFeeStatus === 'pending') {
      toast.error('Admin fee payment is already pending approval');
      return;
    }

    if (adminFeeStatus === 'completed') {
      toast.error('Admin fee has already been paid');
      return;
    }

    if (!isPaymentReady()) {
      toast.error("Please complete the payment setup before proceeding");
      return;
    }

    setLoading(true);

    try {
      if (selectedMethod === "manual" && paymentProof) {
        let imageUrl;
        try {
          imageUrl = await uploadImage(paymentProof);
        } catch (error) {
          alert("Failed to upload image. Please try again.");
          setLoading(false);
          return;
        }

        const response = await fetch("/api/manual-transaction", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sender: userId,
            amount: adminFeeAmount,
            type: "admin",
            image: imageUrl,
            method: "wise",
            note: formData.additionalDetails,
            name: formData.completeName,
            email: formData.registeredEmail,
            username: formData.pashClubUsername,
            transactionId: formData.transactionId,
            wiseAccountEmail: formData.wiseAccountEmail,
          }),
        });

        const res = await response.json();

        console.log(res);
        if (res.success) {
          window.location.href = `${window.location.origin}/success`;
        } else {
          console.log(res);
        }
      }
      if (selectedMethod === "crypto") {
        const paymentData = {
          amount: adminFeeAmount,
          pay_currency: selectedCrypto,
          userId: userId,
        };

        console.log("Sending to backend:", paymentData);

        const res = await axios.post("/api/cryptoPayment", paymentData);
        const data = res.data;

        console.log(data);
        if (data.invoice_url) {
          window.location.href = data.invoice_url;
        } else {
          console.log(data);
        }
      }
    } catch (error) {
      console.error("Payment error:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  if (checkingStatus) {
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
       <div className="text-center mb-12">
          <div className="card relative rounded-3xl shadow-xl p-8 mx-4 border border-[var(--border)] overflow-hidden">
            <div className="absolute top-0 left-0 w-32 h-32 bg-[var(--primary)] opacity-5 rounded-full -translate-x-16 -translate-y-16"></div>
            <div className="absolute bottom-0 right-0 w-40 h-40 bg-[var(--primary)] opacity-5 rounded-full translate-x-20 translate-y-20"></div>

            <div className="relative z-10">
              <div className="relative mb-6">
                <div className="w-24 h-24 header rounded-2xl flex items-center justify-center mx-auto shadow-lg transform hover:scale-105 transition-transform duration-300">
                  <div className="absolute inset-0 opacity-20 rounded-2xl"></div>
                  <svg
                    className="w-12 h-12 text-white filter drop-shadow-lg"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    ></path>
                  </svg>
                </div>

                <div className="absolute top-2 right-1/4 w-3 h-3 bg-green-400 rounded-full animate-ping opacity-75"></div>
                <div className="absolute bottom-4 left-1/4 w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
              </div>

              <div className="mb-6">
                <h1 className="text-4xl md:text-4xl font-bold mb-4 text-[var(--text)]">
                  First Step
                </h1>
                <p className="text-xl text-[var(--textSecondary)] mb-2 max-w-2xl mx-auto leading-relaxed">
                  First step to activate your account
                </p>
                <div className="w-24 h-1 bg-gradient-to-r from-[#8200DB] to-[#6E11B0] rounded-full mx-auto mt-4"></div>
              </div>

              <div className="card-secondary inline-flex items-center justify-center space-x-3 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl px-8 py-4 shadow-lg hover:shadow-xl transition-all duration-300 group hover:border-[var(--border)]/20">
                <div className="flex items-center space-x-2">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-md">
                    <svg
                      className="w-5 h-5 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                      ></path>
                    </svg>
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-[var(--textSecondary)] uppercase tracking-wider">
                      Admin Fee
                    </p>
                    <p className="text-2xl font-bold text-[var(--text)] group-hover:text-[#8200DB] transition-colors duration-300">
                      {adminFeeAmount} USD
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-1 bg-green-50 px-3 py-1 rounded-full border border-green-200">
                  <svg
                    className="w-4 h-4 text-green-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  <span className="text-xs font-semibold text-green-700">
                    Secure
                  </span>
                </div>
              </div>

              <div className="mt-6 flex justify-center items-center space-x-2 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-[#8200DB] rounded-full"></div>
                  <span>Select Method</span>
                </div>
                <div className="w-8 h-0.5 bg-gray-300"></div>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                  <span>Make Payment</span>
                </div>
                <div className="w-8 h-0.5 bg-gray-300"></div>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                  <span>Get Access</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-12">
          <div className="flex items-center space-x-8">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center font-bold">
                ✓
              </div>
              <span className="text-sm font-medium text-green-500 mt-2">
                Registered
              </span>
            </div>
            <div className={`w-16 h-1 ${adminFeeStatus === 'completed' ? 'bg-green-500' : 'bg-[var(--primary)]'}`}></div>
            <div className="flex flex-col items-center">
              <div className={`w-12 h-12 text-white rounded-full flex items-center justify-center font-bold ${
                adminFeeStatus === 'completed' ? 'bg-green-500' : 'bg-[var(--primary)]'
              }`}>
                {adminFeeStatus === 'completed' ? '✓' : '2'}
              </div>
              <span className={`text-sm font-medium mt-2 ${
                adminFeeStatus === 'completed' ? 'text-green-500' : 'text-[var(--primary)]'
              }`}>
                Admin Fee
              </span>
            </div>
            <div className={`w-16 h-1 ${adminFeeStatus === 'completed' ? 'bg-[var(--primary)]' : 'bg-gray-300'}`}></div>
            <div className="flex flex-col items-center">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold ${
                adminFeeStatus === 'completed' ? 'bg-[var(--primary)] text-white' : 'bg-gray-300 text-gray-500'
              }`}>
                3
              </div>
              <span className={`text-sm font-medium mt-2 ${
                adminFeeStatus === 'completed' ? 'text-[var(--primary)]' : 'text-gray-500'
              }`}>
                Continue
              </span>
            </div>
          </div>
        </div>

        {/* Admin Fee Status Display */}
        {adminFeeStatus === 'pending' ? (
          <div className="mb-8">
            <div 
              className="rounded-xl shadow-lg p-6 text-center"
              style={{ 
                backgroundColor: 'var(--card)',
                border: `1px solid var(--border)`
              }}
            >
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: 'var(--accent)', opacity: '0.2' }}>
                <svg className="w-8 h-8" style={{ color: 'var(--accent)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--text)' }}>Payment Pending</h3>
              <p className="opacity-80">Your admin fee payment is currently being reviewed. Please wait for approval.</p>
            </div>
          </div>
        ) : adminFeeStatus === 'completed' ? (
          <div className="mb-8">
            <div 
              className="rounded-xl shadow-lg p-6 text-center"
              style={{ 
                backgroundColor: 'var(--card)',
                border: `1px solid var(--border)`
              }}
            >
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: 'var(--success)', opacity: '0.2' }}>
                <svg className="w-8 h-8" style={{ color: 'var(--success)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--text)' }}>Payment Completed</h3>
              <p className="opacity-80 mb-4">Your admin fee has been successfully paid and approved.</p>
              <button
                onClick={() => router.push('/login')}
                className="button px-6 py-2 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg"
              >
                Continue to Login
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Payment Method Selection */}
            <div className="mb-8">
              <div 
                className="rounded-xl shadow-lg p-6"
                style={{ 
                  backgroundColor: 'var(--card)',
                  border: `1px solid var(--border)`
                }}
              >
                <h3 className="text-xl font-semibold mb-6 text-center" style={{ color: 'var(--text)' }}>
                  Choose Payment Method
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Crypto Payment Option */}
                  <div
                    className={`p-6 rounded-xl cursor-pointer transition-all duration-300 ${
                      selectedMethod === "crypto"
                        ? "border-2 text-white shadow-lg"
                        : "border hover:shadow-md"
                    }`}
                    style={{ 
                      borderColor: selectedMethod === "crypto" ? 'var(--primary)' : 'var(--border)',
                      backgroundColor: selectedMethod === "crypto" ? 'var(--primary)' : 'var(--card)'
                    }}
                    onClick={() => setSelectedMethod("crypto")}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div
                          className="w-12 h-12 rounded-lg flex items-center justify-center"
                          style={{ 
                            backgroundColor: selectedMethod === "crypto" ? 'rgba(255,255,255,0.2)' : 'var(--cardSecondary)'
                          }}
                        >
                          <svg
                            className="w-6 h-6"
                            style={{ color: selectedMethod === "crypto" ? 'white' : 'var(--primary)' }}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                            ></path>
                          </svg>
                        </div>
                        <div>
                          <h4 className="text-lg font-bold">Crypto Payment</h4>
                          <p className={`text-sm ${selectedMethod === "crypto" ? "text-white/80" : "opacity-70"}`}>
                            Instant Processing
                          </p>
                        </div>
                      </div>
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={selectedMethod === "crypto"}
                        onChange={() => setSelectedMethod("crypto")}
                        className="w-5 h-5"
                        style={{ color: 'var(--primary)' }}
                      />
                    </div>
                  </div>

                  {/* WISE Transfer Option */}
                  <div
                    className={`p-6 rounded-xl cursor-pointer transition-all duration-300 ${
                      selectedMethod === "manual"
                        ? "border-2 text-white shadow-lg"
                        : "border hover:shadow-md"
                    }`}
                    style={{ 
                      borderColor: selectedMethod === "manual" ? 'var(--primary)' : 'var(--border)',
                      backgroundColor: selectedMethod === "manual" ? 'var(--primary)' : 'var(--card)'
                    }}
                    onClick={() => setSelectedMethod("manual")}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div
                          className="w-12 h-12 rounded-lg flex items-center justify-center"
                          style={{ 
                            backgroundColor: selectedMethod === "manual" ? 'rgba(255,255,255,0.2)' : 'var(--cardSecondary)'
                          }}
                        >
                          <svg
                            className="w-6 h-6"
                            style={{ color: selectedMethod === "manual" ? 'white' : 'var(--primary)' }}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                            ></path>
                          </svg>
                        </div>
                        <div>
                          <h4 className="text-lg font-bold">WISE Transfer</h4>
                          <p className={`text-sm ${selectedMethod === "manual" ? "text-white/80" : "opacity-70"}`}>
                            1-2 Business Days
                          </p>
                        </div>
                      </div>
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={selectedMethod === "manual"}
                        onChange={() => setSelectedMethod("manual")}
                        className="w-5 h-5"
                        style={{ color: 'var(--primary)' }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Form Content */}
            {selectedMethod && (
              <div className="mb-8">
                <div 
                  className="rounded-xl shadow-lg p-6"
                  style={{ 
                    backgroundColor: 'var(--card)',
                    border: `1px solid var(--border)`
                  }}
                >
                  {selectedMethod === "crypto" && (
                    <div className="space-y-6">
                      <h3 className="text-xl font-semibold mb-4" style={{ color: 'var(--text)' }}>
                        Crypto Payment Details
                      </h3>

                      <div className="flex items-center space-x-3 p-4 rounded-lg" style={{ backgroundColor: 'var(--cardSecondary)' }}>
                        <svg
                          className="w-6 h-6"
                          style={{ color: 'var(--primary)' }}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          ></path>
                        </svg>
                        <div>
                          <p className="text-sm font-medium opacity-80">NowPayments Integration</p>
                          <p className="text-xs opacity-70">Secure crypto payment gateway</p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <label className="block text-sm font-semibold opacity-80">
                          Select Cryptocurrency *
                        </label>
                        <div className="grid grid-cols-1 gap-3">
                          {cryptoOptions.map((crypto) => (
                            <button
                              key={crypto.value}
                              type="button"
                              onClick={() => setSelectedCrypto(crypto.value)}
                              className={`p-4 border-2 rounded-xl text-center transition-all duration-200 ${
                                selectedCrypto === crypto.value
                                  ? "text-white shadow-md"
                                  : "hover:bg-[var(--cardSecondary)]"
                              }`}
                              style={{ 
                                borderColor: selectedCrypto === crypto.value ? 'var(--primary)' : 'var(--border)',
                                backgroundColor: selectedCrypto === crypto.value ? 'var(--primary)' : 'var(--card)',
                                color: selectedCrypto === crypto.value ? 'white' : 'var(--text)'
                              }}
                            >
                              <div className="text-2xl mb-2">{crypto.icon}</div>
                              <div className="text-sm font-medium">
                                {crypto.label}
                              </div>
                            </button>
                          ))}
                        </div>
                        {!selectedCrypto && (
                          <p className="text-red-500 text-xs mt-1">
                            * Please select a cryptocurrency to continue
                          </p>
                        )}
                      </div>

                      <div className="rounded-lg p-4" style={{ backgroundColor: 'var(--cardSecondary)' }}>
                        <h4 className="font-semibold mb-2 opacity-80">How it works:</h4>
                        <ol className="text-sm space-y-1 opacity-80">
                          <li>1. Select your preferred cryptocurrency</li>
                          <li>2. Click "Pay with Crypto" button</li>
                          <li>3. Complete payment through NowPayments</li>
                          <li>4. Instant confirmation and activation</li>
                        </ol>
                      </div>

                      {selectedCrypto && (
                        <div className="rounded-lg p-4" style={{ backgroundColor: 'var(--cardSecondary)' }}>
                          <div className="flex justify-between items-center">
                            <span className="text-sm opacity-80">Selected:</span>
                            <span className="font-semibold" style={{ color: 'var(--primary)' }}>
                              {cryptoOptions.find((c) => c.value === selectedCrypto)?.label}
                            </span>
                          </div>
                          <div className="flex justify-between items-center mt-2">
                            <span className="text-sm opacity-80">Amount:</span>
                            <span className="font-semibold">${adminFeeAmount} USD</span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {selectedMethod === "manual" && (
                    <div className="space-y-6">
                      <h3 className="text-xl font-semibold mb-4" style={{ color: 'var(--text)' }}>
                        WISE Transfer Details
                      </h3>

                      <div className="space-y-4">
                        <h4 className="font-semibold text-lg opacity-80">Payment Instructions</h4>

                        <div className="space-y-4">
                          <div className="p-4 border rounded-xl" style={{ backgroundColor: 'var(--cardSecondary)', borderColor: 'var(--border)' }}>
                            <div className="flex items-start space-x-3">
                              <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'var(--primary)' }}>
                                <span className="text-white font-bold text-lg">W</span>
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center justify-between mb-3">
                                  <p className="font-semibold opacity-80 text-base">Send via WISE</p>
                                  <span className="text-xs px-2 py-1 rounded-full font-medium" style={{ backgroundColor: 'var(--primary)', color: 'white', opacity: '0.8' }}>
                                    International
                                  </span>
                                </div>
                                <div className="space-y-3">
                                  <div className="p-4 rounded-lg border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                                    <p className="font-mono text-sm break-all text-center font-semibold tracking-wide" style={{ color: 'var(--primary)' }}>
                                      mehboob86@gmail.com
                                    </p>
                                  </div>
                                  <div className="flex items-center justify-center space-x-2">
                                    <div className="flex-1 h-px" style={{ backgroundColor: 'var(--border)' }}></div>
                                    <p className="text-xs opacity-70 px-2">OR</p>
                                    <div className="flex-1 h-px" style={{ backgroundColor: 'var(--border)' }}></div>
                                  </div>
                                  <a
                                    href="https://wise.com/pay/me/ranaa156"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block w-full border py-2 px-4 rounded-lg text-center font-medium transition-colors duration-200 hover:shadow-lg"
                                    style={{ 
                                      backgroundColor: 'var(--card)',
                                      borderColor: 'var(--primary)',
                                      color: 'var(--primary)'
                                    }}
                                  >
                                    Use WISE Direct Link
                                  </a>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="rounded-xl p-4" style={{ backgroundColor: 'var(--cardSecondary)', borderColor: 'var(--border)' }}>
                        <div className="flex items-start space-x-3">
                          <svg
                            className="w-5 h-5 mt-0.5 flex-shrink-0"
                            style={{ color: 'var(--accent)' }}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z"
                            ></path>
                          </svg>
                          <div>
                            <p className="text-sm font-medium opacity-80">After Making Payment</p>
                            <p className="text-xs opacity-70 mt-1">
                              Please fill out the confirmation form below to complete your payment process.
                            </p>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => setShowForm(!showForm)}
                        className="w-full py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2 hover:shadow-lg"
                        style={{ 
                          background: `linear-gradient(135deg, var(--primary), var(--secondary))`,
                          color: 'white'
                        }}
                      >
                        <span>{showForm ? "Hide" : "Show"} Confirmation Form</span>
                        <svg
                          className={`w-4 h-4 transition-transform ${showForm ? "rotate-180" : ""}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 9l-7 7-7-7"
                          ></path>
                        </svg>
                      </button>

                      {showForm && (
                        <div className="border rounded-xl p-4" style={{ backgroundColor: 'var(--cardSecondary)', borderColor: 'var(--border)' }}>
                          <h4 className="font-semibold text-center mb-4 opacity-80">Payment Confirmation Form</h4>
                          <p className="text-sm text-center mb-4 opacity-70">
                            Please fill this form after sending the payment
                          </p>

                          <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <label className="block text-sm font-semibold opacity-80">Complete Name *</label>
                                <input
                                  type="text"
                                  name="completeName"
                                  value={formData.completeName}
                                  onChange={handleChange}
                                  onFocus={handleInputFocus}
                                  onBlur={handleInputBlur}
                                  required
                                  className="w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-1 transition-all duration-300 text-sm"
                                  style={{ 
                                    backgroundColor: 'var(--card)',
                                    border: `2px solid var(--border)`,
                                    color: 'var(--text)','--tw-ring-color': 'var(--accent)'
                                  }}
                                  placeholder="Your full name"
                                />
                              </div>
                              <div className="space-y-2">
                                <label className="block text-sm font-semibold opacity-80">Registered Email *</label>
                                <input
                                  type="email"
                                  name="registeredEmail"
                                  value={formData.registeredEmail}
                                  onChange={handleChange}
                                  onFocus={handleInputFocus}
                                  onBlur={handleInputBlur}
                                  required
                                  className="w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-1 transition-all duration-300 text-sm"
                                  style={{ 
                                    backgroundColor: 'var(--card)',
                                    border: `2px solid var(--border)`,
                                    color: 'var(--text)','--tw-ring-color': 'var(--accent)'
                                  }}
                                  placeholder="your@email.com"
                                />
                              </div>
                              <div className="space-y-2">
                                <label className="block text-sm font-semibold opacity-80">WISE Account Email</label>
                                <input
                                  type="email"
                                  name="wiseAccountEmail"
                                  value={formData.wiseAccountEmail}
                                  onChange={handleChange}
                                  onFocus={handleInputFocus}
                                  onBlur={handleInputBlur}
                                  className="w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-1 transition-all duration-300 text-sm"
                                  style={{ 
                                    backgroundColor: 'var(--card)',
                                    border: `2px solid var(--border)`,
                                    color: 'var(--text)','--tw-ring-color': 'var(--accent)'
                                  }}
                                  placeholder="wise@account.com"
                                />
                              </div>
                              <div className="space-y-2">
                                <label className="block text-sm font-semibold opacity-80">PASH.CLUB Username *</label>
                                <input
                                  type="text"
                                  name="pashClubUsername"
                                  value={formData.pashClubUsername}
                                  onChange={handleChange}
                                  onFocus={handleInputFocus}
                                  onBlur={handleInputBlur}
                                  required
                                  className="w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-1 transition-all duration-300 text-sm"
                                  style={{ 
                                    backgroundColor: 'var(--card)',
                                    border: `2px solid var(--border)`,
                                    color: 'var(--text)','--tw-ring-color': 'var(--accent)'
                                  }}
                                  placeholder="Your username"
                                />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <label className="block text-sm font-semibold opacity-80">Transaction ID / Reference</label>
                              <input
                                type="text"
                                name="transactionId"
                                value={formData.transactionId}
                                onChange={handleChange}
                                onFocus={handleInputFocus}
                                onBlur={handleInputBlur}
                                className="w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-1 transition-all duration-300 text-sm"
                                style={{ 
                                  backgroundColor: 'var(--card)',
                                  border: `2px solid var(--border)`,
                                  color: 'var(--text)','--tw-ring-color': 'var(--accent)'
                                }}
                                placeholder="WISE/Interac transaction reference"
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="block text-sm font-semibold opacity-80">Additional Details</label>
                              <textarea
                                name="additionalDetails"
                                value={formData.additionalDetails}
                                onChange={handleChange}
                                onFocus={handleTextareaFocus}
                                onBlur={handleTextareaBlur}
                                rows="3"
                                className="w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-1 transition-all duration-300 text-sm resize-vertical"
                                style={{ 
                                  backgroundColor: 'var(--card)',
                                  border: `2px solid var(--border)`,
                                  color: 'var(--text)','--tw-ring-color': 'var(--accent)'
                                }}
                                placeholder="Any additional information about your payment..."
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="block text-sm font-semibold opacity-80">Upload Payment Receipt *</label>
                              <div 
                                className="border-2 border-dashed rounded-lg p-4 text-center hover:border-[var(--accent)] transition-colors"
                                style={{ 
                                  borderColor: 'var(--border)',
                                  backgroundColor: 'var(--card)'
                                }}
                              >
                                <input
                                  type="file"
                                  accept="image/*,.pdf"
                                  onChange={handlePaymentProof}
                                  onFocus={handleFileFocus}
                                  onBlur={handleFileBlur}
                                  className="hidden"
                                  id="proof-upload"
                                />
                                <label
                                  htmlFor="proof-upload"
                                  className="cursor-pointer block"
                                >
                                  {proofPreview ? (
                                    <div className="space-y-2">
                                      <div className="relative mx-auto w-16 h-16">
                                        <Image
                                          src={proofPreview}
                                          alt="Payment proof preview"
                                          fill
                                          className="object-cover rounded-lg"
                                        />
                                      </div>
                                      <p className="text-sm text-green-600 font-medium">
                                        ✓ Receipt Uploaded
                                      </p>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setPaymentProof(null);
                                          setProofPreview(null);
                                        }}
                                        className="text-xs text-red-600 hover:text-red-800"
                                      >
                                        Remove File
                                      </button>
                                    </div>
                                  ) : (
                                    <div className="space-y-2">
                                      <div className="mx-auto w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--cardSecondary)' }}>
                                        <svg
                                          className="w-5 h-5 opacity-70"
                                          fill="none"
                                          stroke="currentColor"
                                          viewBox="0 0 24 24"
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                          ></path>
                                        </svg>
                                      </div>
                                      <p className="font-medium text-sm opacity-80">Click to upload receipt</p>
                                      <p className="text-xs opacity-70">PNG, JPG, PDF up to 10MB</p>
                                    </div>
                                  )}
                                </label>
                              </div>
                            </div>
                          </form>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {/* Action Buttons */}
            <div className="flex justify-center">
              <div 
                className="rounded-xl shadow-lg p-6 w-full max-w-2xl"
                style={{ 
                  backgroundColor: 'var(--card)',
                  border: `1px solid var(--border)`
                }}
              >
                <div className="text-center space-y-4">
                  <div className="flex justify-center space-x-4">
                    <button
                      type="button"
                      onClick={() => router.back()}
                      className="px-8 py-3 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg"
                      style={{ 
                        backgroundColor: 'var(--cardSecondary)',
                        color: 'var(--text)'
                      }}
                    >
                      Back
                    </button>

                    <button
                      onClick={handleSubmit}
                      disabled={loading || !isPaymentReady()}
                      className="px-8 py-3 rounded-xl font-semibold transition-all duration-300 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                      style={{ 
                        background: `linear-gradient(135deg, var(--primary), var(--secondary))`,
                        color: 'white'
                      }}
                    >
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Processing...
                        </>
                      ) : selectedMethod === "crypto" ? (
                        selectedCrypto ? (
                          `Pay with ${cryptoOptions.find((c) => c.value === selectedCrypto)?.label}`
                        ) : (
                          "Select Cryptocurrency"
                        )
                      ) : paymentProof ? (
                        "Submit Payment"
                      ) : (
                        "Upload Payment Proof"
                      )}
                    </button>
                  </div>

                  <p className="text-sm opacity-70">
                    Secure payment • One-time fee • Instant activation
                  </p>

                  {!isPaymentReady() && (
                    <p className="text-red-500 text-sm font-medium">
                      ⚠️ Please complete the payment setup above to continue
                    </p>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// Wrap the payment form in Suspense
export default function AdminFeePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="card rounded-xl shadow-lg p-12 text-center">
              <div 
                className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto"
                style={{ borderColor: 'var(--primary)' }}
              ></div>
              <p className="mt-4 text-lg opacity-80">Loading payment page...</p>
            </div>
          </div>
        </div>
      }
    >
      <PaymentForm />
    </Suspense>
  );
}