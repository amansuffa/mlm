"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";

export default function CheckEmail() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle, loading, success, error
  const [message, setMessage] = useState("");
  const [showResendForm, setShowResendForm] = useState(false);
  const router = useRouter();
  const { theme } = useTheme();

  async function handleResend(e) {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      
      if (data.status === "already_verified") {
        setStatus("success");
        setMessage("✅ Your email is already verified!");
        // Redirect to login after 2 seconds
        setTimeout(() => router.push("/login"), 2000);
        return;
      }

      if (data.status === "email_sent") {
        setStatus("success");
        setMessage("✅ Verification email sent! Please check your inbox.");
        setEmail("");
        setShowResendForm(false);
      } else if (!res.ok) {
        setStatus("error");
        setMessage(`❌ ${data.error}`);
      }
    } catch (err) {
      setStatus("error");
      setMessage("❌ Something went wrong. Please try again.");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4 text-gray-900">
            Verify Your Email 📧
          </h1>
          {!showResendForm ? (
            <>
              <p className="mb-6 text-gray-600">
                Verification link has been sent to your email
              </p>
              <button
                onClick={() => setShowResendForm(true)}
                className="text-blue-600 hover:text-blue-800 underline"
              >
                Didn&apos;t receive yet? Resend
              </button>
            </>
          ) : (
            <>
              <p className="mb-6 text-gray-600">
                Enter your email address to resend verification
              </p>
              <form onSubmit={handleResend} className="space-y-4">
                <div>
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                    disabled={status === "loading"}
                  />
                </div>
                <button
                  type="submit"
                  disabled={status === "loading" || !email}
                  className="w-full rounded-xl font-medium px-6 py-3 disabled:opacity-50 text-white bg-blue-600 hover:bg-blue-700"
                >
                  {status === "loading" ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                      </svg>
                      Sending...
                    </span>
                  ) : (
                    "Send Verification Email"
                  )}
                </button>
              </form>
            </>
          )}

          {message && (
            <div 
              className={`mt-4 p-4 rounded-lg text-sm ${
                status === "success" 
                  ? "bg-green-100 text-green-700" 
                  : status === "error"
                  ? "bg-red-100 text-red-700"
                  : ""
              }`}
            >
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
