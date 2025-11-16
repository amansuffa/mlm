"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";

export default function CheckEmail() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");
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
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div 
            className="max-w-md w-full rounded-xl shadow-lg p-8"
            style={{ 
              backgroundColor: 'var(--card)',
              border: `1px solid var(--border)`
            }}
          >
            <div className="text-center">
              <h1 className="text-2xl font-bold mb-4" style={{ color: 'var(--text)' }}>
                Verify Your Email 📧
              </h1>
              {!showResendForm ? (
                <>
                  <p className="mb-6 opacity-80">
                    Verification link has been sent to your email
                  </p>
                  <button
                    onClick={() => setShowResendForm(true)}
                    className="underline transition-colors duration-200"
                    style={{ color: 'var(--primary)' }}
                  >
                    Didn&apos;t receive yet? Resend
                  </button>
                </>
              ) : (
                <>
                  <p className="mb-6 opacity-80">
                    Enter your email address to resend verification
                  </p>
                  <form onSubmit={handleResend} className="space-y-4">
                    <div>
                      <input
                        type="email"
                        placeholder="Enter your email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onFocus={(e) => e.target.style.borderColor = 'var(--accent)'}
                        onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
                        className="w-full rounded-xl px-4 py-3 focus:outline-none focus:ring-1 transition-all duration-300"
                        style={{ 
                          backgroundColor: 'var(--cardSecondary)',
                          border: `2px solid var(--border)`,
                          color: 'var(--text)',
                          '--tw-ring-color': 'var(--accent)'
                        }}
                        required
                        disabled={status === "loading"}
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={status === "loading" || !email}
                      className="w-full rounded-xl font-medium px-6 py-3 disabled:opacity-50 transition-all duration-300 hover:shadow-lg"
                      style={{ 
                        background: `linear-gradient(135deg, var(--primary), var(--secondary))`,
                        color: 'white'
                      }}
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
                  className="mt-4 p-4 rounded-lg text-sm"
                  style={{
                    backgroundColor: status === "success" ? 'rgba(34, 197, 94, 0.1)' : status === "error" ? 'rgba(239, 68, 68, 0.1)' : 'var(--cardSecondary)',
                    color: status === "success" ? 'var(--success)' : status === "error" ? '#ef4444' : 'var(--text)',
                    border: `1px solid ${status === "success" ? 'var(--success)' : status === "error" ? '#ef4444' : 'var(--border)'}`
                  }}
                >
                  {message}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}