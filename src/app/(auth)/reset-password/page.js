"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, CheckCircle, AlertCircle, Loader2, Eye, EyeOff, Shield } from "lucide-react";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [validToken, setValidToken] = useState(true);
  const [redirectTimer, setRedirectTimer] = useState(5);

  // Check password strength
  useEffect(() => {
    if (!password) {
      setPasswordStrength(0);
      return;
    }

    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    
    setPasswordStrength(score);
  }, [password]);

  // Validate token on mount
  useEffect(() => {
    if (!token) {
      setValidToken(false);
      setError("Invalid or missing reset token");
    }
  }, [token]);

  // Handle redirect countdown
  useEffect(() => {
    let timer;
    if (message && redirectTimer > 0) {
      timer = setTimeout(() => {
        setRedirectTimer(prev => prev - 1);
      }, 1000);
    }
    if (redirectTimer === 0) {
      router.push("/login");
    }
    return () => clearTimeout(timer);
  }, [message, redirectTimer, router]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setMessage(null);
    
    if (password.length < 6) {
      return setError("Password must be at least 8 characters");
    }
    if (password !== confirm) {
      return setError("Passwords do not match");
    }
    
    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data?.error || "Failed to reset password");
      }
      
      setMessage(data?.message || "Password reset successful!");
      setPassword("");
      setConfirm("");
    } catch (err) {
      setError(err.message || "Something went wrong");
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

  const getStrengthColor = (strength) => {
    if (strength === 0) return '#EF4444';
    if (strength <= 2) return '#F59E0B';
    if (strength <= 3) return '#10B981';
    return '#059669';
  };

  const getStrengthText = (strength) => {
    if (strength === 0) return 'Too weak';
    if (strength <= 2) return 'Fair';
    if (strength <= 3) return 'Good';
    return 'Strong';
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
            <Shield className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold mb-3" style={{ color: 'var(--text)' }}>
            Set New Password
          </h1>
          <p className="text-lg opacity-70">
            Create a new secure password for your account
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
            {!validToken ? (
              // Invalid Token State
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-6">
                  <AlertCircle className="w-8 h-8 text-red-500" />
                </div>
                <h3 className="text-2xl font-bold mb-3" style={{ color: 'var(--text)' }}>
                  Invalid Reset Link
                </h3>
                <p className="text-lg opacity-80 mb-6">
                  This password reset link is invalid or has expired.
                </p>
                <div className="space-y-4">
                  <Link
                    href="/forgot-password"
                    className="button w-full py-4 rounded-xl font-semibold transition-all duration-300 hover:shadow-xl flex items-center justify-center space-x-2 group"
                  >
                    <span>Request New Reset Link</span>
                  </Link>
                  <Link
                    href="/login"
                    className="w-full py-3 rounded-xl font-medium transition-all duration-200 hover:bg-opacity-10 inline-flex items-center justify-center"
                    style={{ 
                      color: 'var(--primary)',
                      backgroundColor: 'var(--primary)',
                      opacity: 0.1
                    }}
                  >
                    Return to Login
                  </Link>
                </div>
              </div>
            ) : message ? (
              // Success State
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
                <h3 className="text-2xl font-bold mb-3" style={{ color: 'var(--text)' }}>
                  Password Updated!
                </h3>
                <p className="text-lg opacity-80 mb-6">
                  Your password has been successfully reset.
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
                      <Lock className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-left">
                      <p className="font-semibold" style={{ color: 'var(--text)' }}>Security Updated</p>
                      <p className="text-sm opacity-70">
                        Redirecting to login in {redirectTimer} second{redirectTimer !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => router.push("/login")}
                  className="button w-full py-4 rounded-xl font-semibold transition-all duration-300 hover:shadow-xl flex items-center justify-center space-x-2"
                >
                  <span>Login Now</span>
                  <span className="animate-pulse">→</span>
                </button>
              </div>
            ) : (
              // Form State
              <>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Password Input */}
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text)' }}>
                      New Password
                    </label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                        <Lock className="w-5 h-5" style={{ color: 'var(--primary)' }} />
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onFocus={handleInputFocus}
                        onBlur={handleInputBlur}
                        placeholder="Enter new password"
                        required
                        className="w-full rounded-xl pl-12 pr-12 py-4 focus:outline-none transition-all duration-300"
                        style={{ 
                          backgroundColor: 'var(--cardSecondary)',
                          border: `2px solid var(--border)`,
                          color: 'var(--text)'
                        }}
                        disabled={loading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 transition-all duration-200 hover:opacity-70"
                        style={{ color: 'var(--primary)' }}
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    
                    {/* Password Strength Meter */}
                    {password && (
                      <div className="mt-3 space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span style={{ color: 'var(--text)' }}>Password strength</span>
                          <span className="font-semibold" style={{ color: getStrengthColor(passwordStrength) }}>
                            {getStrengthText(passwordStrength)}
                          </span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full rounded-full transition-all duration-300"
                            style={{ 
                              width: `${passwordStrength * 25}%`,
                              backgroundColor: getStrengthColor(passwordStrength)
                            }}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2 mt-2 text-xs opacity-70">
                          <div className="flex items-center space-x-1">
                            <div className={`w-1.5 h-1.5 rounded-full ${password.length >= 8 ? 'bg-green-500' : 'bg-gray-300'}`} />
                            <span>8+ characters</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <div className={`w-1.5 h-1.5 rounded-full ${/[A-Z]/.test(password) ? 'bg-green-500' : 'bg-gray-300'}`} />
                            <span>Uppercase letter</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <div className={`w-1.5 h-1.5 rounded-full ${/[0-9]/.test(password) ? 'bg-green-500' : 'bg-gray-300'}`} />
                            <span>Number</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <div className={`w-1.5 h-1.5 rounded-full ${/[^A-Za-z0-9]/.test(password) ? 'bg-green-500' : 'bg-gray-300'}`} />
                            <span>Special character(@#$%^&*/)</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Confirm Password Input */}
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text)' }}>
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                        <Lock className="w-5 h-5" style={{ color: 'var(--primary)' }} />
                      </div>
                      <input
                        type={showConfirm ? "text" : "password"}
                        value={confirm}
                        onChange={(e) => setConfirm(e.target.value)}
                        onFocus={handleInputFocus}
                        onBlur={handleInputBlur}
                        placeholder="Confirm your password"
                        required
                        className="w-full rounded-xl pl-12 pr-12 py-4 focus:outline-none transition-all duration-300"
                        style={{ 
                          backgroundColor: 'var(--cardSecondary)',
                          border: `2px solid var(--border)`,
                          color: 'var(--text)'
                        }}
                        disabled={loading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirm(!showConfirm)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 transition-all duration-200 hover:opacity-70"
                        style={{ color: 'var(--primary)' }}
                      >
                        {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    
                    {/* Password Match Indicator */}
                    {password && confirm && (
                      <div className="mt-2">
                        {password === confirm ? (
                          <div className="flex items-center space-x-2 text-green-600 text-sm">
                            <CheckCircle className="w-4 h-4" />
                            <span>Passwords match</span>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-2 text-red-600 text-sm">
                            <AlertCircle className="w-4 h-4" />
                            <span>Passwords do not match</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Status Messages */}
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

                  {/* Security Tips */}
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
                        <p className="text-sm font-medium mb-1" style={{ color: 'var(--text)' }}>Security Tips</p>
                        <ul className="text-xs opacity-70 space-y-1 list-disc list-inside">
                          <li>Use a combination of letters, numbers, and symbols</li>
                          <li>Avoid using personal information or common words</li>
                          <li>Consider using a password manager for security</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading || !password || !confirm || passwordStrength < 1}
                    className="w-full button py-4 rounded-xl font-semibold transition-all duration-300 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none flex items-center justify-center space-x-2 group"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Updating password...</span>
                      </>
                    ) : (
                      <>
                        <span>Reset Password</span>
                        <Shield className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      </>
                    )}
                  </button>
                </form>

                {/* Support Link */}
                {/* <div className="mt-8 pt-6 border-t text-center" style={{ borderColor: 'var(--border)' }}>
                  <p className="text-sm opacity-70">
                    Having trouble?{" "}
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

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm opacity-60">
            By setting a new password, you agree to our{" "}
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