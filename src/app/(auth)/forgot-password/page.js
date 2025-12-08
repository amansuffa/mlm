"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Mail, ArrowLeft, CheckCircle, AlertCircle, Loader2, Shield } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);
    setSuccess(false);
    
    try {
      const res = await fetch("/api/auth/forgot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data?.error || "Failed to send reset email");
      }
      
      setMessage(data?.message || "Reset email sent. Check your inbox.");
      setSuccess(true);
      setEmail("");
    } catch (err) {
      setError(err.message || "Something went wrong");
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  }

  // Enhanced input handlers
  const handleInputFocus = (e) => {
    e.target.style.borderColor = 'var(--accent)';
    e.target.style.boxShadow = '0 0 0 3px var(--accent-shadow)';
  };

  const handleInputBlur = (e) => {
    e.target.style.borderColor = 'var(--border)';
    e.target.style.boxShadow = 'none';
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6" style={{ 
            backgroundColor: 'var(--primary)',
            color: 'white'
          }}>
            <Mail className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold mb-3" style={{ color: 'var(--text)' }}>
            Reset Your Password
          </h1>
          <p className="text-lg opacity-70">
            Enter your email to receive a secure reset link
          </p>
        </div>

        {/* Main Card */}
        <div 
          className="rounded-2xl shadow-2xl overflow-hidden"
          style={{ 
            backgroundColor: 'var(--card)',
            border: `1px solid var(--border)`
          }}
        >
          <div className="p-8">
            {success ? (
              // Success State
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
                <h3 className="text-2xl font-bold mb-3" style={{ color: 'var(--text)' }}>
                  Check Your Email
                </h3>
                <p className="text-lg opacity-80 mb-6">
                  We&apos;ve sent a password reset link to your email address.
                </p>
                <div 
                  className="rounded-xl p-4 mb-6"
                  style={{ 
                    backgroundColor: 'var(--cardSecondary)',
                    border: `1px solid var(--border)`
                  }}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--primary)' }}>
                      <Mail className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-left">
                      <p className="font-semibold" style={{ color: 'var(--text)' }}>Reset Link Sent</p>
                      <p className="text-sm opacity-70">Check your inbox and spam folder</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <Link
                    href="/login"
                    className="button w-full py-4 rounded-xl font-semibold transition-all duration-300 hover:shadow-xl flex items-center justify-center space-x-2 group"
                  >
                    <span>Return to Login</span>
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                  </Link>
                  <button
                    onClick={() => {
                      setSuccess(false);
                      setMessage(null);
                      setError(null);
                    }}
                    className="w-full py-3 rounded-xl font-medium transition-all duration-200 hover:bg-opacity-10"
                    style={{ 
                      color: 'var(--primary)',
                      backgroundColor: 'var(--primary)',
                      opacity: 0.1
                    }}
                  >
                    Request Another Reset Link
                  </button>
                </div>
              </div>
            ) : (
              // Form State
              <>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Email Input */}
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text)' }}>
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                        <Mail className="w-5 h-5" style={{ color: 'var(--primary)' }} />
                      </div>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onFocus={handleInputFocus}
                        onBlur={handleInputBlur}
                        placeholder="you@example.com"
                        required
                        className="w-full rounded-xl pl-12 pr-4 py-4 focus:outline-none transition-all duration-300"
                        style={{ 
                          backgroundColor: 'var(--cardSecondary)',
                          border: `2px solid var(--border)`,
                          color: 'var(--text)'
                        }}
                        disabled={loading}
                      />
                    </div>
                    <p className="text-xs opacity-60 mt-2">
                      Enter the email address associated with your account
                    </p>
                  </div>

                  {/* Security Info Box */}
                  <div 
                    className="rounded-xl p-4"
                    style={{ 
                      backgroundColor: 'var(--cardSecondary)',
                      border: `1px solid var(--border)`
                    }}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0" style={{ 
                        backgroundColor: 'var(--primary)',
                        color: 'white',
                        fontSize: '12px'
                      }}>
                        !
                      </div>
                      <div>
                        <p className="text-sm font-medium mb-1" style={{ color: 'var(--text)' }}>What to expect</p>
                        <ul className="text-xs opacity-70 space-y-1 list-disc list-inside">
                          <li>A secure password reset link will be sent to your email</li>
                          <li>The link will expire in 1 hour for security</li>
                          <li>If you don&apos;t receive the email, check your spam folder</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Status Messages */}
                  {message && !error && (
                    <div className="rounded-xl p-4 border-l-4" style={{ 
                      backgroundColor: 'var(--cardSecondary)',
                      borderLeftColor: 'var(--accent)'
                    }}>
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 flex-shrink-0" style={{ color: 'var(--accent)' }} />
                        <p className="text-sm" style={{ color: 'var(--text)' }}>{message}</p>
                      </div>
                    </div>
                  )}

                  {error && (
                    <div className="rounded-xl p-4 border-l-4" style={{ 
                      backgroundColor: 'rgba(239, 68, 68, 0.1)',
                      borderLeftColor: '#EF4444'
                    }}>
                      <div className="flex items-center space-x-3">
                        <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-500" />
                        <p className="text-sm text-red-600">{error}</p>
                      </div>
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading || !email}
                    className="w-full button py-4 rounded-xl font-semibold transition-all duration-300 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none flex items-center justify-center space-x-2 group"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Sending reset link...</span>
                      </>
                    ) : (
                      <>
                        <span>Send Reset Link</span>
                        <Mail className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </form>

         

                {/* Support Link */}
                {/* <div className="mt-6 text-center">
                  <p className="text-sm opacity-70">
                    Need help?{" "}
                    <Link
                      href="/support"
                      className="font-medium transition-all duration-200 hover:opacity-80"
                      style={{ color: 'var(--primary)' }}
                    >
                      Contact Support
                    </Link>
                  </p>
                </div> */}
              </>
            )}
          </div>
        </div>

        {/* Back to Login - Bottom */}
        <div className="mt-6 text-center">
          <Link
            href="/login"
            className="inline-flex items-center space-x-2 text-sm font-medium transition-all duration-200 hover:opacity-80 group"
            style={{ color: 'var(--primary)' }}
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to login page</span>
          </Link>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm opacity-60">
            By requesting a reset, you agree to our{" "}
            <Link
              href="/terms"
              className="transition-all duration-200 hover:opacity-80"
              style={{ color: 'var(--primary)' }}
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy"
              className="transition-all duration-200 hover:opacity-80"
              style={{ color: 'var(--primary)' }}
            >
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}