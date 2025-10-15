"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";
import axios from "axios";

export default function AdminFeePage() {
  const router = useRouter();
  const [selectedMethod, setSelectedMethod] = useState("crypto");
  const [selectedCrypto, setSelectedCrypto] = useState(""); // Empty initially
  const [loading, setLoading] = useState(false);
  const [paymentProof, setPaymentProof] = useState(null);
  const [proofPreview, setProofPreview] = useState("");

  const adminFeeAmount = 50;
  const { data: session } = useSession();

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
      return selectedCrypto !== ""; // Crypto selected hona chahiye
    } else if (selectedMethod === "manual") {
      return paymentProof !== null; // Payment proof upload hona chahiye
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isPaymentReady()) {
      alert("Please complete the payment setup before proceeding");
      return;
    }

    setLoading(true);

    try {
      const paymentData = {
        amount: adminFeeAmount,
        pay_currency: selectedCrypto,
        user: {
          id: session?.user?.id,
          name: session?.user?.name,
          email: session?.user?.email,
        },
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
    } catch (error) {
      console.error("Payment error:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-8 mx-4">
            <div className="w-20 h-20 bg-gradient-to-r from-[#8200DB] to-[#6E11B0] rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-10 h-10 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                ></path>
              </svg>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Pay Admin Fee
            </h1>
            <p className="text-xl text-gray-600 mb-4">
              Complete your registration to continue
            </p>
            <div className="bg-gradient-to-r from-[#8200DB] to-[#6E11B0] inline-flex items-center px-6 py-3 rounded-full text-white font-semibold">
              <svg
                className="w-5 h-5 mr-2"
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
              Amount: ${adminFeeAmount} USD
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
            <div className="w-16 h-1 bg-[#8200DB]"></div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-[#8200DB] text-white rounded-full flex items-center justify-center font-bold">
                2
              </div>
              <span className="text-sm font-medium text-[#8200DB] mt-2">
                Admin Fee
              </span>
            </div>
            <div className="w-16 h-1 bg-gray-300"></div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-gray-300 text-gray-500 rounded-full flex items-center justify-center font-bold">
                3
              </div>
              <span className="text-sm font-medium text-gray-500 mt-2">
                Continue
              </span>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mx-4">
          {/* Crypto Payment Method */}
          <div
            className={`bg-white rounded-2xl shadow-lg border-2 transition-all duration-300 ${
              selectedMethod === "crypto"
                ? "border-[#8200DB] shadow-xl"
                : "border-gray-200"
            }`}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Crypto Payment
                  </h3>
                  <p className="text-green-600 text-sm font-medium">
                    Instant Processing
                  </p>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={selectedMethod === "crypto"}
                    onChange={() => setSelectedMethod("crypto")}
                    className="w-5 h-5 text-[#8200DB] focus:ring-[#8200DB]"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                  <svg
                    className="w-6 h-6 text-[#8200DB]"
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
                    <p className="text-sm font-medium text-gray-700">
                      NowPayments Integration
                    </p>
                    <p className="text-xs text-gray-600">
                      Secure crypto payment gateway
                    </p>
                  </div>
                </div>

                {/* Crypto Selection */}
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-gray-700">
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
                            ? "border-[#8200DB] bg-[#8200DB] text-white shadow-md"
                            : "border-gray-200 bg-white text-gray-700 hover:border-[#8200DB] hover:bg-blue-50"
                        }`}
                      >
                        <div className="text-2xl mb-2">{crypto.icon}</div>
                        <div className="text-sm font-medium">
                          {crypto.label}
                        </div>
                      </button>
                    ))}
                  </div>
                  {selectedMethod === "crypto" && !selectedCrypto && (
                    <p className="text-red-500 text-xs mt-1">
                      * Please select a cryptocurrency to continue
                    </p>
                  )}
                </div>

                <div className="bg-green-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">
                    How it works:
                  </h4>
                  <ol className="text-sm text-gray-600 space-y-1">
                    <li>1. Select your preferred cryptocurrency</li>
                    <li>2. Click &quot;Pay with Crypto&quot; button</li>
                    <li>3. Complete payment through NowPayments</li>
                    <li>4. Instant confirmation and activation</li>
                  </ol>
                </div>

                {/* Selected Crypto Info */}
                {selectedCrypto && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Selected:</span>
                      <span className="font-semibold text-[#8200DB]">
                        {
                          cryptoOptions.find((c) => c.value === selectedCrypto)
                            ?.label
                        }
                      </span>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-sm text-gray-600">Amount:</span>
                      <span className="font-semibold">${adminFeeAmount} USD</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Manual Payment Method */}
          <div
            className={`bg-white rounded-2xl shadow-lg border-2 h-full transition-all duration-300 ${
              selectedMethod === "manual"
                ? "border-[#8200DB] shadow-xl"
                : "border-gray-200"
            }`}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Bank Transfer
                  </h3>
                  <p className="text-orange-600 text-sm font-medium">
                    1-2 Business Days
                  </p>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={selectedMethod === "manual"}
                    onChange={() => setSelectedMethod("manual")}
                    className="w-5 h-5 text-[#8200DB] focus:ring-[#8200DB]"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 bg-orange-50 rounded-lg">
                  <svg
                    className="w-6 h-6 text-orange-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      Manual Processing
                    </p>
                    <p className="text-xs text-gray-600">
                      Requires payment proof verification
                    </p>
                  </div>
                </div>

                <div className="space-y-3 flex flex-col justify-between">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-3">
                      Bank Details
                    </h4>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between items-center py-1 border-b border-gray-100">
                        <span className="text-gray-600">Amount:</span>
                        <span className="font-medium text-[#8200DB]">
                          ${adminFeeAmount} USD
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-1 border-b border-gray-100">
                        <span className="text-gray-600">Bank Name:</span>
                        <span className="font-medium text-right">
                          MLM Business Bank
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-1">
                        <span className="text-gray-600">Account Number:</span>
                        <span className="font-medium">1234567890</span>
                      </div>
                    </div>
                  </div>

                  {/* Payment Proof Upload */}
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#8200DB] transition-colors">
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={handlePaymentProof}
                      className="hidden"
                      id="proof-upload"
                    />
                    <label
                      htmlFor="proof-upload"
                      className="cursor-pointer block"
                    >
                      {proofPreview ? (
                        <div className="space-y-3">
                          <Image
                            src={proofPreview}
                            alt="Payment proof preview"
                            width={96}
                            height={96}
                            className="mx-auto h-24 object-cover rounded-lg shadow-sm"
                          />
                          <p className="text-sm text-green-600 font-medium">
                            ✓ Proof Uploaded
                          </p>
                          <button
                            type="button"
                            onClick={() => setPaymentProof(null)}
                            className="text-xs text-red-600 hover:text-red-800"
                          >
                            Remove
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                            <svg
                              className="w-6 h-6 text-gray-400"
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
                          <p className="text-gray-600 font-medium">
                            Upload Payment Proof *
                          </p>
                          <p className="text-xs text-gray-500">
                            Bank receipt or transaction screenshot
                          </p>
                        </div>
                      )}
                    </label>
                  </div>
                  {selectedMethod === "manual" && !paymentProof && (
                    <p className="text-red-500 text-xs text-center">
                      * Please upload payment proof to continue
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center mt-12 mx-4">
          <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-2xl">
            <div className="text-center space-y-4">
              <div className="flex justify-center space-x-4">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-300 font-semibold"
                >
                  Back
                </button>

                <button
                  onClick={handleSubmit}
                  disabled={loading || !isPaymentReady()}
                  className="px-8 py-3 bg-gradient-to-r from-[#8200DB] to-[#6E11B0] text-white rounded-xl hover:from-[#6E11B0] hover:to-[#8200DB] transition-all duration-300 font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {loading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Processing...
                    </>
                  ) : selectedMethod === "crypto" ? (
                    selectedCrypto ? (
                      `Pay with ${
                        cryptoOptions.find((c) => c.value === selectedCrypto)
                          ?.label
                      }`
                    ) : (
                      "Select Cryptocurrency"
                    )
                  ) : (
                    paymentProof ? "Submit Payment Proof" : "Upload Payment Proof"
                  )}
                </button>
              </div>

              <p className="text-sm text-gray-500">
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
      </div>
    </div>
  );
}