"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import allowedCountries from "@/utils/countries.json";
import countryCodes from "@/utils/countryCodes.json";
import ReCAPTCHA from "react-google-recaptcha";

export default function Signup() {

  const [loading, setLoading] = useState(false);
  const [sponsorUsername, setSponsorUsername] = useState("Admin");
  const [password, setPassword] = useState("");
  const [passwordValid, setPasswordValid] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [captchaToken, setCaptchaToken] = useState(null);
  const [captchaError, setCaptchaError] = useState(false);
  const [phoneError, setPhoneError] = useState("");
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

  const validatePhoneNumber = (phone) => {
    // Remove all non-digit characters
    const cleaned = phone.replace(/\D/g, '');
    // Phone number should be 7-15 digits
    if (cleaned.length < 7 || cleaned.length > 15) {
      return "Phone number must be between 7 and 15 digits";
    }
    return "";
  };

  const handlePhoneChange = (e) => {
    const phone = e.target.value;
    setFormData({...formData, phoneNumber: phone});
    setPhoneError(validatePhoneNumber(phone));
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
    if (!captchaToken) {
      toast.error("Please complete the captcha verification");
      return;
    }
    if (phoneError) {
      toast.error(phoneError);
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
        captchaToken,
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

  // Step logic removed: the form now shows all sections on a single page.

  return (
    <div className="min-h-screen bg-[var(--background)] py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Animated Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="header rounded-2xl shadow-xl overflow-hidden mb-6">
            <div className="px-8 py-8">
              <h1 className="text-3xl lg:text-4xl font-bold text-white mb-4 animate-slide-down">
                Welcome to PASH.CLUB
              </h1>
              <p className="text-blue-100 text-lg animate-slide-up">
                Start your journey to financial freedom
              </p>
            </div>
          </div>

          {/* Progress steps removed — all sections are shown on one page */}
        </div>

        {/* Registration Form */}
        <div className="card rounded-2xl shadow-xl overflow-hidden animate-fade-in-up">
          <div className="p-8">


            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Step 1: Personal Information */}
                <div className="space-y-6 animate-slide-in-right">
                  {/* Instructions */}
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
                    <p className="font-semibold mb-3 text-blue-800">Please carefully read the instructions below before creating your account:</p>
                    <ul className="space-y-2 text-sm text-blue-800">
                      <li><strong>Step 1 – Create Your Account:</strong> Fill in the form on this page with your correct details to register. And confirm your email address. (Be sure to check inbox/spam box)</li>
                      <li><strong>Step 2 – Payment Page:</strong> After completing the form, you will be redirected to the payment page.</li>
                      <li>You will be required to pay a one-time $50 admin fee.</li>
                      <li>Payments can be made via crypto (USDT -BSC Network) and Wise/Bank Transfer.</li>
                    </ul>
                  </div>
                  <h2 className="text-2xl font-bold text-[var(--text)] mb-6">Personal Information</h2>
                  
                  
                  {/* Sponsor Username */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-[var(--textSecondary)]">Sponsor Username</label>
                    <input
                      type="text"
                      value={sponsorUsername}
                       onFocus={(e) => (e.target.style.borderColor = "var(--primary)")}
                        onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
                      style={{ "--tw-ring-color": "var(--primary)" }}
                      readOnly
                      className="card-secondary w-full rounded-xl px-4 py-3 focus:outline-none focus:ring-1 transition-all duration-300"
                    />
                  </div>

                  {/* Name Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-[var(--textSecondary)]">First Name *</label>
                      <input
                        name="firstName"
                        type="text"
                        value={formData.firstName}
                        onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                        required
                        className="card-secondary w-full rounded-xl px-4 py-3 focus:outline-none focus:ring-1 transition-all duration-300"
                        onFocus={(e) => (e.target.style.borderColor = "var(--primary)")}
                        onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
                        style={{ "--tw-ring-color": "var(--primary)" }}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-[var(--textSecondary)]">Middle Name</label>
                      <input
                        name="middleName"
                        type="text"
                        value={formData.middleName}
                        onChange={(e) => setFormData({...formData, middleName: e.target.value})}
                        className="card-secondary w-full rounded-xl px-4 py-3 focus:outline-none focus:ring-1 transition-all duration-300"
                        onFocus={(e) => (e.target.style.borderColor = "var(--primary)")}
                        onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
                        style={{ "--tw-ring-color": "var(--primary)" }}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-[var(--textSecondary)]">Last Name *</label>
                      <input
                        name="lastName"
                        type="text"
                        value={formData.lastName}
                        onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                        required
                        className="card-secondary w-full rounded-xl px-4 py-3 focus:outline-none focus:ring-1 transition-all duration-300"
                        onFocus={(e) => (e.target.style.borderColor = "var(--primary)")}
                        onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
                        style={{ "--tw-ring-color": "var(--primary)" }}
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-[var(--textSecondary)]">Email *</label>
                    <input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      required
                      className="card-secondary w-full rounded-xl px-4 py-3 focus:outline-none focus:ring-1 transition-all duration-300"
                      onFocus={(e) => (e.target.style.borderColor = "var(--primary)")}
                      onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
                      style={{ "--tw-ring-color": "var(--primary)" }}
                    />
                  </div>
                </div>

              {/* Step 2: Contact & Location */}
                <div className="space-y-6 animate-slide-in-right">
                  <h2 className="text-2xl font-bold text-[var(--text)] mb-6">Contact & Location</h2>
                  
                  {/* Phone */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-[var(--textSecondary)]">Country Code *</label>
                      <select
                        name="countryCode"
                        value={formData.countryCode}
                        onChange={(e) => setFormData({...formData, countryCode: e.target.value})}
                        required
                        className="card-secondary w-full rounded-xl px-4 py-3 focus:outline-none focus:ring-1 transition-all duration-300"
                        onFocus={(e) => (e.target.style.borderColor = "var(--primary)")}
                        onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
                        style={{ "--tw-ring-color": "var(--primary)" }}
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
                      <label className="block text-sm font-medium text-[var(--textSecondary)]">Phone Number *</label>
                      <input
                        name="phoneNumber"
                        type="tel"
                        value={formData.phoneNumber}
                        onChange={handlePhoneChange}
                        required
                        placeholder="(555) 123-4567"
                        className={`card-secondary w-full rounded-xl px-4 py-3 focus:outline-none focus:ring-1 transition-all duration-300 ${
                          phoneError ? 'border-red-500 focus:ring-red-500/20' : ''
                        }`}
                        onFocus={(e) => (e.target.style.borderColor = phoneError ? "#ef4444" : "var(--primary)")}
                        onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
                        style={{ "--tw-ring-color": phoneError ? "#ef4444" : "var(--primary)" }}
                      />
                      {phoneError && (
                        <p className="text-xs text-red-600 mt-1">{phoneError}</p>
                      )}
                    </div>
                  </div>

                  {/* Location */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-[var(--textSecondary)]">City *</label>
                      <input
                        name="city"
                        type="text"
                        value={formData.city}
                        onChange={(e) => setFormData({...formData, city: e.target.value})}
                        required
                        className="card-secondary w-full rounded-xl px-4 py-3 focus:outline-none focus:ring-1 transition-all duration-300"
                        onFocus={(e) => (e.target.style.borderColor = "var(--primary)")}
                        onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
                        style={{ "--tw-ring-color": "var(--primary)" }}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-[var(--textSecondary)]">Province *</label>
                      <input
                        name="province"
                        type="text"
                        value={formData.province}
                        onChange={(e) => setFormData({...formData, province: e.target.value})}
                        required
                        className="card-secondary w-full rounded-xl px-4 py-3 focus:outline-none focus:ring-1 transition-all duration-300"
                        onFocus={(e) => (e.target.style.borderColor = "var(--primary)")}
                        onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
                        style={{ "--tw-ring-color": "var(--primary)" }}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-[var(--textSecondary)]">Country *</label>
                      <select
                        name="country"
                        value={formData.country}
                        onChange={(e) => setFormData({...formData, country: e.target.value})}
                        required
                        className="card-secondary w-full rounded-xl px-4 py-3 focus:outline-none focus:ring-1 transition-all duration-300"
                        onFocus={(e) => (e.target.style.borderColor = "var(--primary)")}
                        onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
                        style={{ "--tw-ring-color": "var(--primary)" }}
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

              {/* Step 3: Account Security */}
                <div className="space-y-6 animate-slide-in-right">
                  <h2 className="text-2xl font-bold text-[var(--text)] mb-6">Account Security</h2>
                  
                  {/* Password */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-[var(--textSecondary)]">Password *</label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={handlePasswordChange}
                        required
                        className={`card-secondary w-full rounded-xl px-4 py-3 pr-12 focus:outline-none focus:ring-2 transition-all duration-300 ${
                          password && !passwordValid 
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' 
                            : ''
                        }`}
                        onFocus={(e) => !passwordValid && password ? null : (e.target.style.borderColor = "var(--primary)")}
                        onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
                        style={password && !passwordValid ? {} : { "--tw-ring-color": "var(--primary)" }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showPassword ? (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                          </svg>
                        )}
                      </button>
                    </div>
                    <div className="mt-4 p-4 card-secondary rounded-xl">
                      <p className="font-medium text-[var(--text)] mb-3">Password Requirements:</p>
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
                            <span className={password && req.test(password) ? 'text-green-600' : 'text-[var(--textSecondary)]'}>
                              {req.text}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Username */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-[var(--textSecondary)]">Choose Username *</label>
                    <input
                      name="username"
                      type="text"
                      value={formData.username}
                      onChange={(e) => setFormData({...formData, username: e.target.value})}
                      required
                      className="card-secondary w-full rounded-xl px-4 py-3 focus:outline-none focus:ring-1 transition-all duration-300"
                      onFocus={(e) => (e.target.style.borderColor = "var(--primary)")}
                      onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
                      style={{ "--tw-ring-color": "var(--primary)" }}
                    />
                    <p className="text-xs text-[var(--textSecondary)] mt-1">Username can&apos;t be changed</p>
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
                      <ul className="space-y-1 text-sm text-red-800">
                        <li>• Only create your account if you are ready to make the $50 admin fee payment immediately. You can buy USDT from major exchanges i.e., Binance, Kucoin or pay the admin fee using Wise transfer using your debit/credit card or bank account. You can get a Wise account &ndash; <a href="https://wise.com/invite/irhc/ranaa156" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Click Here</a></li>
                        <li>• In addition to the admin fee, you will also need to pay the $500 membership fee directly to your sponsor to fully activate your account and access the system.</li>
                        <li>• If you are not prepared to make these payments, please do not create an account at this time.</li>
                        <li>• Due to local regulatory restrictions, PASH.CLUB does not provide services or accept registrations from residents of Pakistan, Somalia, Sudan, the Democratic Republic of Congo, and Yemen. By proceeding, you confirm that you are not a resident of these countries.</li>
                      </ul>
                    </div>

                    <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                      <p className="text-sm text-green-800 font-medium">
                        ✅ Once your payments are confirmed, your account will be activated and you&apos;ll gain full access to the PASH.CLUB system.
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
                        className="mt-1 w-4 h-4 text-[var(--primary)] border-gray-300 rounded focus:ring-[var(--primary)]"
                      />
                      <label className="text-sm text-[var(--text)]">
                        I agree to the privacy, Terms, affiliate and payment policies *
                      </label>
                    </div>

                    <div className="pt-2">
                      <ReCAPTCHA
                        sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
                        onChange={(token) => setCaptchaToken(token)}
                        onExpired={() => setCaptchaToken(null)}
                        onErrored={() => setCaptchaError(true)}
                      />
                      {!process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY && (
                        <p className="text-sm text-red-600 mt-2">⚠️ reCAPTCHA is not configured. Please contact support.</p>
                      )}
                      {captchaError && (
                        <p className="text-sm text-red-600 mt-2">⚠️ reCAPTCHA verification failed. Please try again.</p>
                      )}
                    </div>
                  </div>
                </div>

              {/* Submit Button */}
              <div className="flex justify-end pt-6 border-[var(--border)]">
                <button
                  type="submit"
                  disabled={loading || !passwordValid || !agreedToTerms || !captchaToken}
                  className="button-secondary px-8 py-3 text-white rounded-xl transition-all duration-300 font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
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
              </div>
            </form>

            <div className="mt-8 text-center border-t border-[var(--border)] pt-6">
              <p className="text-sm text-[var(--text)]">
                Already a member?{' '}
                <Link href="/login" className="text-[var(--primary)] hover:underline font-semibold transition-all duration-300">
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