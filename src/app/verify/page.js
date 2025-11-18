"use client";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
import { useTheme } from "next-themes";

export default function VerifyPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyContent />
    </Suspense>
  );
}

function VerifyContent() {
  const searchParams = useSearchParams();
  const status = searchParams.get("status");
  const reason = searchParams.get("reason");
  const { theme } = useTheme();

  const getVerificationStatus = () => {
    if (status === "success") return "success";
    if (status === "already") return "already";
    return "fail";
  };

  const verificationStatus = getVerificationStatus();

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div 
            className="shadow-lg rounded-xl p-8 max-w-md w-full text-center"
            style={{ 
              backgroundColor: 'var(--card)',
              border: `1px solid var(--border)`
            }}
          >
            {verificationStatus === "success" && (
              <>
                <div 
                  className="w-24 h-24 rounded-full bg-green-600/10 flex items-center justify-center mx-auto mb-6"
                  
                >
                  <svg
                    className="w-12 h-12 text-green-600"
          
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h1 className="text-2xl font-bold text-green-600 mb-4" >Email Verified</h1>
                <p className="opacity-80 mb-6">Your email has been verified successfully. You can now login.</p>
                <Link href="/login">
                  <button 
                    className="px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg"
                    style={{ 
                      background: `linear-gradient(135deg, var(--primary), var(--secondary))`,
                      color: 'white'
                    }}
                  >
                    Go to Login
                  </button>
                </Link>
              </>
            )}

            {verificationStatus === "already" && (
              <>
                <div 
                  className="w-24 h-24 rounded-full bg-green-600/10 flex items-center justify-center mx-auto mb-6"
                 
                >
                  <svg
                    className="w-12 h-12 text-green-600"

                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h1 className="text-2xl font-bold mb-4 text-green-600" >Already Verified</h1>
                <p className="opacity-80 mb-6">Your email is already verified. You can login to your account.</p>
                <Link href="/login">
                  <button 
                    className="px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg"
                    style={{ 
                      background: `linear-gradient(135deg, var(--primary), var(--secondary))`,
                      color: 'white'
                    }}
                  >
                    Go to Login
                  </button>
                </Link>
              </>
            )}

            {verificationStatus === "fail" && (
              <>
                <div 
                  className="w-24 h-24 rounded-full bg-red-600/10 flex items-center justify-center mx-auto mb-6"
          
                >
                  <svg
                    className="w-12 h-12 text-red-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <h1 className="text-2xl font-bold mb-4" style={{ color: '#ef4444' }}>Verification Failed</h1>
                <p className="opacity-80 mb-6">
                  {reason === "expired_or_invalid" 
                    ? "This verification link has expired or is no longer valid."
                    : reason === "no_token"
                    ? "No verification token provided."
                    : reason === "already_verified"
                    ? "This email has already been verified."
                    : "There was a problem verifying your email."}
                </p>
                <div className="flex justify-center space-x-4">
                  <Link href="/">
                    <button 
                      className="px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg"
                      style={{ 
                        backgroundColor: 'var(--cardSecondary)',
                        color: 'var(--text)',
                        border: `1px solid var(--border)`
                      }}
                    >
                      Go to Home
                    </button>
                  </Link>
                  <Link href="/check-email">
                    <button 
                      className="px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg"
                      style={{ 
                        background: `linear-gradient(135deg, var(--primary), var(--secondary))`,
                        color: 'white'
                      }}
                    >
                      Request New Link
                    </button>
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}