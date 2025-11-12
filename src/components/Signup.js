"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";

export default function Signup() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sponsorUsername, setSponsorUsername] = useState("Admin");
  const [password, setPassword] = useState("");
  const [passwordValid, setPasswordValid] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const allowedCountries = [
    "Afghanistan", "Albania", "Algeria", "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan", "Bahrain", "Bangladesh", "Belarus", "Belgium", "Bolivia", "Bosnia and Herzegovina", "Brazil", "Bulgaria", "Cambodia", "Canada", "Chile", "China", "Colombia", "Croatia", "Czech Republic", "Denmark", "Ecuador", "Egypt", "Estonia", "Ethiopia", "Finland", "France", "Georgia", "Germany", "Ghana", "Greece", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kuwait", "Latvia", "Lebanon", "Lithuania", "Luxembourg", "Malaysia", "Mexico", "Morocco", "Netherlands", "New Zealand", "Nigeria", "Norway", "Oman", "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Russia", "Saudi Arabia", "Serbia", "Singapore", "Slovakia", "Slovenia", "South Africa", "South Korea", "Spain", "Sri Lanka", "Sweden", "Switzerland", "Thailand", "Turkey", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Venezuela", "Vietnam"
  ];

  const countryCodes = [
    { country: "Afghanistan", code: "+93" }, { country: "Albania", code: "+355" }, { country: "Algeria", code: "+213" }, { country: "Argentina", code: "+54" }, { country: "Armenia", code: "+374" }, { country: "Australia", code: "+61" }, { country: "Austria", code: "+43" }, { country: "Azerbaijan", code: "+994" }, { country: "Bahrain", code: "+973" }, { country: "Bangladesh", code: "+880" }, { country: "Belarus", code: "+375" }, { country: "Belgium", code: "+32" }, { country: "Bolivia", code: "+591" }, { country: "Bosnia and Herzegovina", code: "+387" }, { country: "Brazil", code: "+55" }, { country: "Bulgaria", code: "+359" }, { country: "Cambodia", code: "+855" }, { country: "Canada", code: "+1" }, { country: "Chile", code: "+56" }, { country: "China", code: "+86" }, { country: "Colombia", code: "+57" }, { country: "Croatia", code: "+385" }, { country: "Czech Republic", code: "+420" }, { country: "Denmark", code: "+45" }, { country: "Ecuador", code: "+593" }, { country: "Egypt", code: "+20" }, { country: "Estonia", code: "+372" }, { country: "Ethiopia", code: "+251" }, { country: "Finland", code: "+358" }, { country: "France", code: "+33" }, { country: "Georgia", code: "+995" }, { country: "Germany", code: "+49" }, { country: "Ghana", code: "+233" }, { country: "Greece", code: "+30" }, { country: "Hungary", code: "+36" }, { country: "Iceland", code: "+354" }, { country: "India", code: "+91" }, { country: "Indonesia", code: "+62" }, { country: "Iran", code: "+98" }, { country: "Iraq", code: "+964" }, { country: "Ireland", code: "+353" }, { country: "Israel", code: "+972" }, { country: "Italy", code: "+39" }, { country: "Japan", code: "+81" }, { country: "Jordan", code: "+962" }, { country: "Kazakhstan", code: "+7" }, { country: "Kenya", code: "+254" }, { country: "Kuwait", code: "+965" }, { country: "Latvia", code: "+371" }, { country: "Lebanon", code: "+961" }, { country: "Lithuania", code: "+370" }, { country: "Luxembourg", code: "+352" }, { country: "Malaysia", code: "+60" }, { country: "Mexico", code: "+52" }, { country: "Morocco", code: "+212" }, { country: "Netherlands", code: "+31" }, { country: "New Zealand", code: "+64" }, { country: "Nigeria", code: "+234" }, { country: "Norway", code: "+47" }, { country: "Oman", code: "+968" }, { country: "Peru", code: "+51" }, { country: "Philippines", code: "+63" }, { country: "Poland", code: "+48" }, { country: "Portugal", code: "+351" }, { country: "Qatar", code: "+974" }, { country: "Romania", code: "+40" }, { country: "Russia", code: "+7" }, { country: "Saudi Arabia", code: "+966" }, { country: "Serbia", code: "+381" }, { country: "Singapore", code: "+65" }, { country: "Slovakia", code: "+421" }, { country: "Slovenia", code: "+386" }, { country: "South Africa", code: "+27" }, { country: "South Korea", code: "+82" }, { country: "Spain", code: "+34" }, { country: "Sri Lanka", code: "+94" }, { country: "Sweden", code: "+46" }, { country: "Switzerland", code: "+41" }, { country: "Thailand", code: "+66" }, { country: "Turkey", code: "+90" }, { country: "Ukraine", code: "+380" }, { country: "United Arab Emirates", code: "+971" }, { country: "United Kingdom", code: "+44" }, { country: "United States", code: "+1" }, { country: "Uruguay", code: "+598" }, { country: "Venezuela", code: "+58" }, { country: "Vietnam", code: "+84" }
  ];

  useEffect(() => {
    const refFromUrl = searchParams.get("ref");
    if (refFromUrl) setSponsorUsername(refFromUrl);
  }, [searchParams]);

  const validatePassword = (pwd) => {
    const hasLower = /[a-z]/.test(pwd);
    const hasUpper = /[A-Z]/.test(pwd);
    const hasNumber = /\d/.test(pwd);
    const hasSpecial = /[@#$%^&*\/]/.test(pwd);
    const validLength = pwd.length <= 32 && pwd.length >= 8;
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
      setError("Please ensure your password meets all requirements");
      return;
    }
    if (!agreedToTerms) {
      setError("Please agree to the terms and policies");
      return;
    }
    if (!captchaVerified) {
      setError("Please complete the captcha verification");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const formData = new FormData(e.currentTarget);
      const data = {
        sponsorUsername,
        firstName: formData.get("firstName"),
        middleName: formData.get("middleName"),
        lastName: formData.get("lastName"),
        email: formData.get("email"),
        countryCode: formData.get("countryCode"),
        phoneNumber: formData.get("phoneNumber"),
        city: formData.get("city"),
        province: formData.get("province"),
        country: formData.get("country"),
        password,
        username: formData.get("username"),
      };

      const res = await axios.post("/api/signup", data);
      if (res.status === 201) {
        router.push("/payment");
      }
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-600 mb-4">🚀 Welcome to PASH.CLUB – Join Now</h1>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-left">
            <p className="font-semibold mb-3">Please carefully read the instructions below before creating your account:</p>
            <ul className="space-y-2 text-sm">
              <li><strong>Step 1 – Create Your Account:</strong> Fill in the form on this page with your correct details to register. And confirm your email address. (Be sure to check inbox/spam box)</li>
              <li><strong>Step 2 – Payment Page:</strong> After completing the form, you will be redirected to the payment page.</li>
              <li>You will be required to pay a one-time $50 admin fee.</li>
              <li>Payments can be made via crypto (USDT -BSC Network) and Wise/Bank Transfer.</li>
            </ul>
          </div>
        </div>

        {/* Registration Form */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Sponsor Username */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sponsor Username</label>
              <input
                type="text"
                value={sponsorUsername}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600"
              />
            </div>

            {/* Name Fields */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                <input
                  name="firstName"
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Middle Name (Optional)</label>
                <input
                  name="middleName"
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                <input
                  name="lastName"
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
              <input
                name="email"
                type="email"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Phone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Country Code *</label>
                <select
                  name="countryCode"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Code</option>
                  {countryCodes.map((item) => (
                    <option key={item.code} value={item.code}>
                      {item.code} ({item.country})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                <input
                  name="phoneNumber"
                  type="tel"
                  required
                  placeholder="(555) 123-4567"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Location */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                <input
                  name="city"
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Province *</label>
                <input
                  name="province"
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Country *</label>
                <select
                  name="country"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password *</label>
              <input
                type="password"
                value={password}
                onChange={handlePasswordChange}
                required
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  password && !passwordValid ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              <div className="mt-2 text-xs text-gray-600">
                <p className="font-medium mb-1">Please choose an Account Password that contains all of the following:</p>
                <ul className="space-y-1">
                  <li className={password && /[a-z]/.test(password) ? 'text-green-600' : 'text-red-500'}>• At least 1 lower case character</li>
                  <li className={password && /[A-Z]/.test(password) ? 'text-green-600' : 'text-red-500'}>• At least 1 upper case character</li>
                  <li className={password && /\d/.test(password) ? 'text-green-600' : 'text-red-500'}>• At least 1 number</li>
                  <li className={password && /[@#$%^&*\/]/.test(password) ? 'text-green-600' : 'text-red-500'}>• At least 1 special character (@#$%^&*/)</li>
                  <li className={password && password.length <= 32 && password.length >= 8 ? 'text-green-600' : 'text-red-500'}>• Password cannot exceed 32 characters</li>
                  <li className={password && !/\s/.test(password) ? 'text-green-600' : 'text-red-500'}>• Password cannot contain spaces</li>
                </ul>
              </div>
            </div>

            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Choose Username *</label>
              <input
                name="username"
                type="text"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="mt-1 text-xs text-gray-500">Username can't be changed</p>
            </div>

            {/* Important Information Sections */}
            <div className="space-y-6">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <p className="text-sm mb-4">
                  <strong>Important:</strong> To ensure our emails are delivered to your inbox, please add (info@pash.club) to your address book/contacts list.
                </p>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <h3 className="font-bold text-red-800 mb-3">⚠️ Important Reminder:</h3>
                <ul className="space-y-2 text-sm text-red-700">
                  <li>• Only create your account if you are ready to make the $50 admin fee payment immediately. You can buy USDT from major exchanges i.e., Binance, Kucoin or pay the admin fee using Wise transfer using your debit/credit card or bank account. You can get a Wise account – <a href="https://wise.com/invite/irhc/ranaa156" className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">Click Here</a>.</li>
                  <li>• In addition to the admin fee, you will also need to pay the $500 membership fee directly to your sponsor to fully activate your account and access the system.</li>
                  <li>• If you are not prepared to make these payments, please do not create an account at this time.</li>
                  <li>• Due to local regulatory restrictions, PASH.CLUB does not provide services or accept registrations from residents of Pakistan, Somalia, Sudan, the Democratic Republic of Congo, and Yemen. By proceeding, you confirm that you are not a resident of these countries.</li>
                </ul>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <p className="text-sm text-green-800">
                  <strong>✅ Once your payments are confirmed, your account will be activated and you'll gain full access to the PASH.CLUB system.</strong>
                </p>
              </div>
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-start">
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="mt-1 mr-3"
              />
              <label className="text-sm text-gray-700">
                I have read and agree to the privacy, Terms, affiliate and payment policies
              </label>
            </div>

            {/* Captcha */}
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={captchaVerified}
                onChange={(e) => setCaptchaVerified(e.target.checked)}
              />
              <span className="text-sm text-gray-700">I'm not a robot (Captcha verification)</span>
            </div>

            <button
              type="submit"
              disabled={loading || !passwordValid || !agreedToTerms || !captchaVerified}
              className={`w-full py-3 px-4 rounded-md font-medium ${
                loading || !passwordValid || !agreedToTerms || !captchaVerified
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              } text-white transition-colors`}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already a member?{' '}
              <Link href="/login" className="text-blue-600 hover:underline font-medium">
                Login Here
              </Link>
            </p>
          </div>
        </div>


      </div>
    </div>
  );
}
