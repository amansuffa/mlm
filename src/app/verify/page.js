"use client";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

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

  const getVerificationStatus = () => {
    if (status === "success") return "success";
    if (status === "already") return "already";
    return "fail";
  };

  const verificationStatus = getVerificationStatus();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white shadow-lg rounded-xl p-8 max-w-md w-full text-center">
        {verificationStatus === "success" && (
          <>
            <h1 className="text-2xl font-bold mb-4">✅ Email Verified</h1>
            <p className="text-gray-600">Your email has been verified successfully. You can now login.</p>
            <Link href="/login">
              <button className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Go to Login
              </button>
            </Link>
          </>
        )}

        {verificationStatus === "already" && (
          <>
            <h1 className="text-2xl font-bold mb-4">✅ Already Verified</h1>
            <p className="text-gray-600">Your email is already verified. You can login to your account.</p>
            <Link href="/login">
              <button className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Go to Login
              </button>
            </Link>
          </>
        )}

        {verificationStatus === "fail" && (
          <>
            <h1 className="text-2xl font-bold mb-4">❌ Verification Failed</h1>
            <p className="text-gray-600">
              {reason === "expired_or_invalid" 
                ? "This verification link has expired or is no longer valid."
                : reason === "no_token"
                ? "No verification token provided."
                : reason === "already_verified"
                ? "This email has already been verified."
                : "There was a problem verifying your email."}
            </p>
            <div className="mt-6 flex justify-center space-x-4">
              <Link href="/">
                <button className="px-6 py-2 border rounded-lg hover:bg-gray-50">
                  Go to Home
                </button>
              </Link>
              <Link href="/check-email">
                <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Request New Link
                </button>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
