"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";
import axios from "axios";

export default function AdminFeePage() {
  const router = useRouter();
  const [selectedMethod, setSelectedMethod] = useState("crypto");
  const [selectedCrypto, setSelectedCrypto] = useState(""); 
  const [loading, setLoading] = useState(false);
  const [paymentProof, setPaymentProof] = useState(null);
  const [proofPreview, setProofPreview] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    completeName: "",
    registeredEmail: "",
    wiseAccountEmail: "",
    pashClubUsername: "",
    transactionId: "",
    additionalDetails: ""
  });

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
      return selectedCrypto !== ""; 
    } else if (selectedMethod === "manual") {
      return paymentProof !== null; 
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
      [e.target.name]: e.target.value
    });
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
        {/* <div className="text-center mb-8">
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
        </div> */}
        <div className="text-center mb-12">
      <div className="relative bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-xl p-8 mx-4 border border-gray-100 overflow-hidden">
      
        <div className="absolute top-0 left-0 w-32 h-32 bg-[#8200DB] opacity-5 rounded-full -translate-x-16 -translate-y-16"></div>
        <div className="absolute bottom-0 right-0 w-40 h-40 bg-[#6E11B0] opacity-5 rounded-full translate-x-20 translate-y-20"></div>
        
     
        <div className="relative z-10">
     
          <div className="relative mb-6">
            <div className="w-24 h-24 bg-gradient-to-br from-[#8200DB] to-[#6E11B0] rounded-2xl flex items-center justify-center mx-auto shadow-lg transform hover:scale-105 transition-transform duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-white to-transparent opacity-20 rounded-2xl"></div>
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
            <h1 className="text-4xl md:text-4xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              First Step
            </h1>
            <p className="text-xl text-gray-600 mb-2 max-w-2xl mx-auto leading-relaxed">
              Final step to activate your account and access all features
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-[#8200DB] to-[#6E11B0] rounded-full mx-auto mt-4"></div>
          </div>

          <div className="inline-flex items-center justify-center space-x-3 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl px-8 py-4 shadow-lg hover:shadow-xl transition-all duration-300 group hover:border-[#8200DB]/20">
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
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Admin Fee</p>
                <p className="text-2xl font-bold text-gray-900 group-hover:text-[#8200DB] transition-colors duration-300">
                  {adminFeeAmount} USD
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-1 bg-green-50 px-3 py-1 rounded-full border border-green-200">
              <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
              </svg>
              <span className="text-xs font-semibold text-green-700">Secure</span>
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

        {/* Payment Method Selection */}
        <div className="mx-4 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Choose Payment Method</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Crypto Payment Option */}
              <div
                className={`p-6 border-2 rounded-xl cursor-pointer transition-all duration-300 ${
                  selectedMethod === "crypto"
                    ? "border-[#8200DB] bg-[#8200DB] text-white shadow-lg"
                    : "border-gray-200 hover:border-[#8200DB] hover:shadow-md"
                }`}
                onClick={() => setSelectedMethod("crypto")}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      selectedMethod === "crypto" ? "bg-white/20" : "bg-green-100"
                    }`}>
                      <svg className={`w-6 h-6 ${
                        selectedMethod === "crypto" ? "text-white" : "text-green-600"
                      }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-lg font-bold">Crypto Payment</h4>
                      <p className={`text-sm ${
                        selectedMethod === "crypto" ? "text-white/80" : "text-green-600"
                      }`}>Instant Processing</p>
                    </div>
                  </div>
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={selectedMethod === "crypto"}
                    onChange={() => setSelectedMethod("crypto")}
                    className="w-5 h-5 text-[#8200DB] focus:ring-[#8200DB]"
                  />
                </div>
              </div>

              {/* WISE Transfer Option */}
              <div
                className={`p-6 border-2 rounded-xl cursor-pointer transition-all duration-300 ${
                  selectedMethod === "manual"
                    ? "border-[#8200DB] bg-[#8200DB] text-white shadow-lg"
                    : "border-gray-200 hover:border-[#8200DB] hover:shadow-md"
                }`}
                onClick={() => setSelectedMethod("manual")}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      selectedMethod === "manual" ? "bg-white/20" : "bg-orange-100"
                    }`}>
                      <svg className={`w-6 h-6 ${
                        selectedMethod === "manual" ? "text-white" : "text-orange-600"
                      }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-lg font-bold">WISE Transfer</h4>
                      <p className={`text-sm ${
                        selectedMethod === "manual" ? "text-white/80" : "text-orange-600"
                      }`}>1-2 Business Days</p>
                    </div>
                  </div>
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={selectedMethod === "manual"}
                    onChange={() => setSelectedMethod("manual")}
                    className="w-5 h-5 text-[#8200DB] focus:ring-[#8200DB]"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Form Content */}
        {selectedMethod && (
          <div className="mx-4 mb-8">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              {selectedMethod === "crypto" && (
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Crypto Payment Details</h3>
                  
                  <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg">
                    <svg className="w-6 h-6 text-[#8200DB]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <div>
                      <p className="text-sm font-medium text-gray-700">NowPayments Integration</p>
                      <p className="text-xs text-gray-600">Secure crypto payment gateway</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="block text-sm font-semibold text-gray-700">Select Cryptocurrency *</label>
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
                          <div className="text-sm font-medium">{crypto.label}</div>
                        </button>
                      ))}
                    </div>
                    {!selectedCrypto && (
                      <p className="text-red-500 text-xs mt-1">* Please select a cryptocurrency to continue</p>
                    )}
                  </div>

                  <div className="bg-green-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">How it works:</h4>
                    <ol className="text-sm text-gray-600 space-y-1">
                      <li>1. Select your preferred cryptocurrency</li>
                      <li>2. Click "Pay with Crypto" button</li>
                      <li>3. Complete payment through NowPayments</li>
                      <li>4. Instant confirmation and activation</li>
                    </ol>
                  </div>

                  {selectedCrypto && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Selected:</span>
                        <span className="font-semibold text-[#8200DB]">
                          {cryptoOptions.find((c) => c.value === selectedCrypto)?.label}
                        </span>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-sm text-gray-600">Amount:</span>
                        <span className="font-semibold">${adminFeeAmount} USD</span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {selectedMethod === "manual" && (
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">WISE Transfer Details</h3>
                  
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900 text-lg">Payment Instructions</h4>
                    
                    <div className="space-y-4">
                      <div className="p-4 border border-blue-200 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 shadow-sm">
                        <div className="flex items-start space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm">
                            <span className="text-white font-bold text-lg">W</span>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-3">
                              <p className="font-semibold text-gray-900 text-base">Send via WISE</p>
                              <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full font-medium">International</span>
                            </div>
                            <div className="space-y-3">
                              <div className="bg-white p-4 rounded-lg border border-blue-100 shadow-sm">
                                <p className="text-[#8200DB] font-mono text-sm break-all text-center font-semibold tracking-wide">
                                  mehboob86@gmail.com
                                </p>
                              </div>
                              <div className="flex items-center justify-center space-x-2">
                                <div className="flex-1 h-px bg-gray-200"></div>
                                <p className="text-xs text-gray-500 px-2">OR</p>
                                <div className="flex-1 h-px bg-gray-200"></div>
                              </div>
                              <a 
                                href="https://wise.com/pay/me/ranaa156" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="block w-full bg-white border border-[#8200DB] text-[#8200DB] hover:bg-[#8200DB] hover:text-white py-2 px-4 rounded-lg text-center font-medium transition-colors duration-200 shadow-sm"
                              >
                                Use WISE Direct Link
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 border border-green-200 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 shadow-sm">
                        <div className="flex items-start space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm">
                            <span className="text-white font-bold text-base">CA</span>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-3">
                              <p className="font-semibold text-gray-900 text-base">Interac e-Transfer</p>
                              <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-medium">Canadians Only</span>
                            </div>
                            <div className="bg-white p-4 rounded-lg border border-green-100 shadow-sm space-y-3">
                              <div className="flex justify-between items-center py-1">
                                <span className="text-gray-600 text-sm font-medium">Email:</span>
                                <span className="font-semibold text-gray-900 text-sm">mehboob86@gmail.com</span>
                              </div>
                              <div className="h-px bg-gray-100"></div>
                              <div className="flex justify-between items-center py-1">
                                <span className="text-gray-600 text-sm font-medium">Recipient Name:</span>
                                <span className="font-semibold text-gray-900 text-sm">Rana Mahbood Ahmad</span>
                              </div>
                            </div>
                            <div className="mt-3 text-xs text-gray-500 bg-yellow-50 p-2 rounded-lg border border-yellow-100">
                              💡 Make sure to use the exact email and name above for successful transfer
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                    <div className="flex items-start space-x-3">
                      <svg className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                      </svg>
                      <div>
                        <p className="text-sm font-medium text-yellow-800">After Making Payment</p>
                        <p className="text-xs text-yellow-700 mt-1">
                          Please fill out the confirmation form below to complete your payment process.
                        </p>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setShowForm(!showForm)}
                    className="w-full bg-[#8200DB] text-white py-3 rounded-lg font-semibold hover:bg-[#6a00b5] transition-colors flex items-center justify-center space-x-2"
                  >
                    <span>{showForm ? 'Hide' : 'Show'} Confirmation Form</span>
                    <svg 
                      className={`w-4 h-4 transition-transform ${showForm ? 'rotate-180' : ''}`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </button>

                  {showForm && (
                    <div className="border border-gray-200 rounded-xl p-4 bg-gray-50">
                      <h4 className="font-semibold text-gray-900 mb-4 text-center">Payment Confirmation Form</h4>
                      <p className="text-sm text-gray-600 text-center mb-4">
                        Please fill this form after sending the payment
                      </p>
                      
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-700">Complete Name *</label>
                            <input
                              type="text"
                              name="completeName"
                              value={formData.completeName}
                              onChange={handleChange}
                              required
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8200DB] focus:border-transparent text-sm"
                              placeholder="Your full name"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-700">Registered Email *</label>
                            <input
                              type="email"
                              name="registeredEmail"
                              value={formData.registeredEmail}
                              onChange={handleChange}
                              required
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8200DB] focus:border-transparent text-sm"
                              placeholder="your@email.com"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-700">WISE Account Email</label>
                            <input
                              type="email"
                              name="wiseAccountEmail"
                              value={formData.wiseAccountEmail}
                              onChange={handleChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8200DB] focus:border-transparent text-sm"
                              placeholder="wise@account.com"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-700">PASH.CLUB Username *</label>
                            <input
                              type="text"
                              name="pashClubUsername"
                              value={formData.pashClubUsername}
                              onChange={handleChange}
                              required
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8200DB] focus:border-transparent text-sm"
                              placeholder="Your username"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="block text-sm font-semibold text-gray-700">Transaction ID / Reference</label>
                          <input
                            type="text"
                            name="transactionId"
                            value={formData.transactionId}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8200DB] focus:border-transparent text-sm"
                            placeholder="WISE/Interac transaction reference"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="block text-sm font-semibold text-gray-700">Additional Details</label>
                          <textarea
                            name="additionalDetails"
                            value={formData.additionalDetails}
                            onChange={handleChange}
                            rows="3"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8200DB] focus:border-transparent text-sm"
                            placeholder="Any additional information about your payment..."
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="block text-sm font-semibold text-gray-700">Upload Payment Receipt *</label>
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-[#8200DB] transition-colors bg-white">
                            <input
                              type="file"
                              accept="image/*,.pdf"
                              onChange={handlePaymentProof}
                              className="hidden"
                              id="proof-upload"
                            />
                            <label htmlFor="proof-upload" className="cursor-pointer block">
                              {proofPreview ? (
                                <div className="space-y-2">
                                  <div className="relative mx-auto w-16 h-16">
                                    <Image
                                      src={proofPreview}
                                      alt="Payment proof preview"
                                      fill
                                      className="object-cover rounded-lg shadow-sm"
                                    />
                                  </div>
                                  <p className="text-sm text-green-600 font-medium">✓ Receipt Uploaded</p>
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
                                  <div className="mx-auto w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                                    </svg>
                                  </div>
                                  <p className="text-gray-600 font-medium text-sm">Click to upload receipt</p>
                                  <p className="text-xs text-gray-500">PNG, JPG, PDF up to 10MB</p>
                                </div>
                              )}
                            </label>
                          </div>
                        </div>
                        <button
                          type="submit"
                          disabled={!paymentProof}
                          className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Submit Payment Confirmation
                        </button>
                      </form>
                    </div>
                  )}

                  <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-[#8200DB] rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Processing Time</p>
                        <p className="text-xs text-gray-600 mt-1">
                          Account activation takes 1-2 business days after payment verification.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-center mt-8 mx-4">
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