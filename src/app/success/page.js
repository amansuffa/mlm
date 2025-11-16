"use client";
import { useTheme } from "next-themes";
import Link from "next/link";

export default function Success() {
  const { theme } = useTheme();

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div 
            className="rounded-xl shadow-lg p-8 text-center max-w-2xl w-full"
            style={{ 
              backgroundColor: 'var(--card)',
              border: `1px solid var(--border)`
            }}
          >
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
            
            <h1 className="text-3xl font-bold mb-6" style={{ color: 'var(--success)' }}>
              Form Submitted Successfully!
            </h1>
            
            <p className="text-lg mb-4" style={{ color: 'var(--text)' }}>
              Thank you for your <strong>$50 admin fee payment!</strong>
            </p>
            
            <p className="mb-6 opacity-80 leading-relaxed">
              Our team will verify and activate your account manually.
              <br />
              You'll get an email once it's approved — then you can log in and send your
              <strong> $500 membership fee</strong> to your sponsor to complete your activation. 🚀
            </p>

            <p className="mb-8 opacity-80">
              Welcome to the movement — your journey to financial freedom starts here! 💎
            </p>

            <div 
              className="rounded-xl p-4 mb-6"
              style={{ 
                backgroundColor: 'var(--cardSecondary)',
                border: `1px solid var(--border)`
              }}
            >
              <p className="text-sm" style={{ color: 'var(--text)' }}>
                <strong>Important:</strong> To ensure our emails are delivered to your inbox,
                please add <strong>info@pash.club</strong> to your contacts list.
              </p>
            </div>
            
            <Link
              href="/"
              className="px-8 py-3 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg inline-block"
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