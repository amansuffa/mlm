"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import allowedCountries from "@/utils/countries.json";
import countryCodes from "@/utils/countryCodes.json";

export default function Signup() {

  const [loading, setLoading] = useState(false);
  const [sponsorUsername, setSponsorUsername] = useState("Admin");
  const [password, setPassword] = useState("");
  const [passwordValid, setPasswordValid] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    email: '',
    countryCode: '',
    phoneNumber: '',
    city: '',
    province: '',
    country: '',
    username: ''
  });
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const refFromUrl = searchParams.get("ref");
    if (refFromUrl) setSponsorUsername(refFromUrl);
  }, [searchParams]);

  const validatePassword = (pwd) => {
    if (!pwd) return false;
    const hasLower = /[a-z]/.test(pwd);
    const hasUpper = /[A-Z]/.test(pwd);
    const hasNumber = /\d/.test(pwd);
    const hasSpecial = /[@#$%^&*\/]/.test(pwd);
    const validLength = pwd.length >= 8 && pwd.length <= 32;
    const noSpaces = !/\s/.test(pwd);
    
    return hasLower && hasUpper && hasNumber && hasSpecial && validLength && noSpaces;
  };

  const handlePasswordChange = (e) => {
    const pwd = e.target.value;
    setPassword(pwd);
    setPasswordValid(validatePassword(pwd));
  };

  async function handleSubmit(e) {
    e.preventDefault();
    if (!passwordValid) {
      toast.error("Please ensure your password meets all requirements");
      return;
    }
    if (!agreedToTerms) {
      toast.error("Please agree to the terms and policies");
      return;
    }
    if (!captchaVerified) {
      toast.error("Please complete the captcha verification");
      return;
    }

    setLoading(true);

    try {
      const data = {
        sponsorUsername,
        firstName: formData.firstName,
        middleName: formData.middleName,
        lastName: formData.lastName,
        email: formData.email,
        countryCode: formData.countryCode,
        phoneNumber: formData.phoneNumber,
        city: formData.city,
        province: formData.province,
        country: formData.country,
        password,
        username: formData.username,
      };

      const res = await axios.post("/api/signup", data);
      if (res.status === 201) {
        router.push("/check-email");
      }
    } catch (err) {
      toast.error(err.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  const validateStep = (step) => {
    if (step === 1) {
      return formData.firstName && formData.lastName && formData.email;
    }
    if (step === 2) {
      return formData.countryCode && formData.phoneNumber && 
             formData.city && formData.province && formData.country;
    }
    return true;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 3));
    } else {
      toast.error('Please fill in all required fields before proceeding');
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Animated Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="bg-gradient-to-r from-[#8200DB] to-[#6E11B0] rounded-2xl shadow-xl overflow-hidden mb-6">
            <div className="px-8 py-8">
              <h1 className="text-3xl lg:text-4xl font-bold text-white mb-4 animate-slide-down">
                🚀 Welcome to PASH.CLUB
              </h1>
              <p className="text-blue-100 text-lg animate-slide-up">
                Start your journey to financial freedom
              </p>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center space-x-4">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300 ${
                    step === currentStep 
                      ? 'bg-[#8200DB] text-white scale-110 shadow-lg' 
                      : step < currentStep 
                      ? 'bg-green-500 text-white' 
                      : 'bg-gray-300 text-gray-600'
                  }`}>
                    {step < currentStep ? '✓' : step}
                  </div>
                  {step < 3 && (
                    <div className={`w-12 h-1 transition-all duration-300 ${
                      step < currentStep ? 'bg-green-500' : 'bg-gray-300'
                    }`}></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Registration Form */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden animate-fade-in-up">
          <div className="p-8">


            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Step 1: Personal Information */}
              {currentStep === 1 && (
                <div className="space-y-6 animate-slide-in-right">
                  {/* Instructions */}
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
                    <p className="font-semibold mb-3 text-blue-800">Please carefully read the instructions below before creating your account:</p>
                    <ul className="space-y-2 text-sm text-blue-700">
                      <li><strong>Step 1 – Create Your Account:</strong> Fill in the form on this page with your correct details to register. And confirm your email address. (Be sure to check inbox/spam box)</li>
                      <li><strong>Step 2 – Payment Page:</strong> After completing the form, you will be redirected to the payment page.</li>
                      <li>You will be required to pay a one-time $50 admin fee.</li>
                      <li>Payments can be made via crypto (USDT -BSC Network) and Wise/Bank Transfer.</li>
                    </ul>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Personal Information</h2>
                  
                  
                  {/* Sponsor Username */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Sponsor Username</label>
                    <input
                      type="text"
                      value={sponsorUsername}
                      readOnly
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 bg-gray-50 text-gray-600 transition-all duration-300"
                    />
                  </div>

                  {/* Name Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">First Name *</label>
                      <input
                        name="firstName"
                        type="text"
                        value={formData.firstName}
                        onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                        required
                        className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#8200DB] focus:ring-2 focus:ring-[#8200DB]/20 transition-all duration-300"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Middle Name</label>
                      <input
                        name="middleName"
                        type="text"
                        value={formData.middleName}
                        onChange={(e) => setFormData({...formData, middleName: e.target.value})}
                        className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#8200DB] focus:ring-2 focus:ring-[#8200DB]/20 transition-all duration-300"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Last Name *</label>
                      <input
                        name="lastName"
                        type="text"
                        value={formData.lastName}
                        onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                        required
                        className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#8200DB] focus:ring-2 focus:ring-[#8200DB]/20 transition-all duration-300"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Email *</label>
                    <input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      required
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#8200DB] focus:ring-2 focus:ring-[#8200DB]/20 transition-all duration-300"
                    />
                  </div>
                </div>
              )}

              {/* Step 2: Contact & Location */}
              {currentStep === 2 && (
                <div className="space-y-6 animate-slide-in-right">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Contact & Location</h2>
                  
                  {/* Phone */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Country Code *</label>
                      <select
                        name="countryCode"
                        value={formData.countryCode}
                        onChange={(e) => setFormData({...formData, countryCode: e.target.value})}
                        required
                        className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#8200DB] focus:ring-2 focus:ring-[#8200DB]/20 transition-all duration-300 bg-white"
                      >
                        <option value="">Select Code</option>
                        {countryCodes.map((item, index) => (
                          <option key={`${item.code}-${item.country}-${index}`} value={item.code}>
                            {item.code} ({item.country})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Phone Number *</label>
                      <input
                        name="phoneNumber"
                        type="tel"
                        value={formData.phoneNumber}
                        onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                        required
                        placeholder="(555) 123-4567"
                        className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#8200DB] focus:ring-2 focus:ring-[#8200DB]/20 transition-all duration-300"
                      />
                    </div>
                  </div>

                  {/* Location */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">City *</label>
                      <input
                        name="city"
                        type="text"
                        value={formData.city}
                        onChange={(e) => setFormData({...formData, city: e.target.value})}
                        required
                        className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#8200DB] focus:ring-2 focus:ring-[#8200DB]/20 transition-all duration-300"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Province *</label>
                      <input
                        name="province"
                        type="text"
                        value={formData.province}
                        onChange={(e) => setFormData({...formData, province: e.target.value})}
                        required
                        className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#8200DB] focus:ring-2 focus:ring-[#8200DB]/20 transition-all duration-300"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Country *</label>
                      <select
                        name="country"
                        value={formData.country}
                        onChange={(e) => setFormData({...formData, country: e.target.value})}
                        required
                        className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#8200DB] focus:ring-2 focus:ring-[#8200DB]/20 transition-all duration-300 bg-white"
                      >
                        <option value="">Select Country</option>
                        {allowedCountries.map((country) => (
                          <option key={country} value={country}>
                            {country}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Account Security */}
              {currentStep === 3 && (
                <div className="space-y-6 animate-slide-in-right">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Account Security</h2>
                  
                  {/* Password */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Password *</label>
                    <input
                      type="password"
                      value={password}
                      onChange={handlePasswordChange}
                      required
                      className={`w-full border-2 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 transition-all duration-300 ${
                        password && !passwordValid 
                          ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' 
                          : 'border-gray-200 focus:border-[#8200DB] focus:ring-[#8200DB]/20'
                      }`}
                    />
                    <div className="mt-4 p-4 bg-gray-50 rounded-xl">
                      <p className="font-medium text-gray-700 mb-3">Password Requirements:</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                        {[
                          { test: (pwd) => /[a-z]/.test(pwd), text: "1 lowercase character" },
                          { test: (pwd) => /[A-Z]/.test(pwd), text: "1 uppercase character" },
                          { test: (pwd) => /\d/.test(pwd), text: "1 number" },
                          { test: (pwd) => /[@#$%^&*\/]/.test(pwd), text: "1 special character (@#$%^&*/)" },
                          { test: (pwd) => pwd.length >= 8 && pwd.length <= 32, text: "8-32 characters" },
                          { test: (pwd) => !/\s/.test(pwd), text: "No spaces" }
                        ].map((req, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <div className={`w-2 h-2 rounded-full transition-all duration-300 ${
                              password && req.test(password) ? 'bg-green-500' : 'bg-gray-300'
                            }`}></div>
                            <span className={password && req.test(password) ? 'text-green-600' : 'text-gray-500'}>
                              {req.text}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Username */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Choose Username *</label>
                    <input
                      name="username"
                      type="text"
                      value={formData.username}
                      onChange={(e) => setFormData({...formData, username: e.target.value})}
                      required
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#8200DB] focus:ring-2 focus:ring-[#8200DB]/20 transition-all duration-300"
                    />
                    <p className="text-xs text-gray-500 mt-1">Username can't be changed</p>
                  </div>

                  {/* Important Information */}
                  <div className="space-y-4">
                    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 animate-pulse">
                      <p className="text-sm text-yellow-800">
                        <strong>Important:</strong> To ensure our emails are delivered to your inbox, please add <span className="font-mono">info@pash.club</span> to your address book/contacts list.
                      </p>
                    </div>

                    <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                      <h3 className="font-bold text-red-800 mb-2">⚠️ Important Reminder:</h3>
                      <ul className="space-y-1 text-sm text-red-700">
                        <li>• Only create your account if you are ready to make the $50 admin fee payment immediately. You can buy USDT from major exchanges i.e., Binance, Kucoin or pay the admin fee using Wise transfer using your debit/credit card or bank account. You can get a Wise account – <a href="https://wise.com/invite/irhc/ranaa156" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Click Here</a>.</li>
                        <li>• In addition to the admin fee, you will also need to pay the $500 membership fee directly to your sponsor to fully activate your account and access the system.</li>
                        <li>• If you are not prepared to make these payments, please do not create an account at this time.</li>
                        <li>• Due to local regulatory restrictions, PASH.CLUB does not provide services or accept registrations from residents of Pakistan, Somalia, Sudan, the Democratic Republic of Congo, and Yemen. By proceeding, you confirm that you are not a resident of these countries.</li>
                      </ul>
                    </div>

                    <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                      <p className="text-sm text-green-800 font-medium">
                        ✅ Once your payments are confirmed, your account will be activated and you'll gain full access to the PASH.CLUB system.
                      </p>
                    </div>
                  </div>

                  {/* Terms & Captcha */}
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <input
                        type="checkbox"
                        checked={agreedToTerms}
                        onChange={(e) => setAgreedToTerms(e.target.checked)}
                        className="mt-1 w-4 h-4 text-[#8200DB] border-gray-300 rounded focus:ring-[#8200DB]"
                      />
                      <label className="text-sm text-gray-700">
                        I agree to the privacy, Terms, affiliate and payment policies *
                      </label>
                    </div>

                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={captchaVerified}
                        onChange={(e) => setCaptchaVerified(e.target.checked)}
                        className="w-4 h-4 text-[#8200DB] border-gray-300 rounded focus:ring-[#8200DB]"
                      />
                      <span className="text-sm text-gray-700">I'm not a robot</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-6 border-gray-200">
                {currentStep > 1 ? (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 font-semibold"
                  >
                    ← Previous
                  </button>
                ) : (
                  <div></div>
                )}

                {currentStep < 3 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="px-8 py-3 bg-gradient-to-r from-[#8200DB] to-[#6E11B0] text-white rounded-xl hover:from-[#6E11B0] hover:to-[#8200DB] transition-all duration-300 font-semibold shadow-lg hover:shadow-xl"
                  >
                    Next Step →
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={loading || !passwordValid || !agreedToTerms || !captchaVerified}
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
                        Creating Account...
                      </>
                    ) : (
                      "Create Account"
                    )}
                  </button>
                )}
              </div>
            </form>

            <div className="mt-8 text-center border-t border-gray-200 pt-6">
              <p className="text-sm text-gray-600">
                Already a member?{' '}
                <Link href="/login" className="text-[#8200DB] hover:underline font-semibold transition-all duration-300">
                  Login Here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Add CSS animations */}
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slide-in-right {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes slide-down {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-fade-in { animation: fade-in 0.6s ease-out; }
        .animate-fade-in-up { animation: fade-in-up 0.6s ease-out; }
        .animate-slide-in-right { animation: slide-in-right 0.5s ease-out; }
        .animate-slide-down { animation: slide-down 0.6s ease-out; }
        .animate-slide-up { animation: slide-up 0.6s ease-out; }
        .animate-shake { animation: shake 0.5s ease-in-out; }
        .animate-pulse { animation: pulse 2s infinite; }
      `}</style>
    </div>
  );
}