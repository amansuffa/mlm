"use client";
import Link from "next/link";
import React from "react";

export default function PayToSponser() {
  return (
    <div className="rounded-2xl shadow-lg p-6" style={{ backgroundColor: 'var(--card)', border:`1px solid var(--border)`}}>
     
      
      <h3 className="text-lg font-bold mb-3" style={{ color: 'var(--text)' }}>✅ Complete your step 2, Pay $500 to sponser</h3>
      <p className="text-sm mb-4" style={{ color: 'var(--text)', opacity: 0.8 }}>
        Payments are confirmed manually by your sponsor. Please ensure you
        upload proof of payment. Approval may take 24–48 hours.
      </p>
      <Link href="/user/pay-to-sponser" className="inline-block px-4 py-2 rounded-lg text-white font-medium" style={{ background: 'linear-gradient(to right, var(--primary), var(--secondary))' }}>
        Pay now & Upload Proof
      </Link>
    </div>
  );
}
