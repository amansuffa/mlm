"use client";
import { useTheme } from "next-themes";
import Link from "next/link";

export default function Cancel() {
  const { theme } = useTheme();

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div 
            className="rounded-xl shadow-lg p-12 text-center max-w-md w-full"
            style={{ 
              backgroundColor: 'var(--card)',
              border: `1px solid var(--border)`
            }}
          >
            <div 
              className="w-24 h-24 rounded-full flex bg-red-600/10 items-center justify-center mx-auto mb-4"
      
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
            <h1 className="text-2xl font-bold mb-4" style={{ color: 'var(--text)' }}>
              Payment Cancelled
            </h1>
            <p className="mb-6 opacity-80">
              Your payment was not completed. You can try again later.
            </p>
            <Link
              href="/"
              className="px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg inline-block"
              style={{ 
                background: `linear-gradient(135deg, var(--primary), var(--secondary))`,
                color: 'white'
              }}
            >
              Go to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
