"use client";
import React from "react";

export default function ConfirmPayments() {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h3 className="text-lg font-bold text-gray-700 mb-3">✅ Confirm Payments</h3>
      <p className="text-sm text-gray-600 mb-4">
        Payments are confirmed manually by your sponsor. Please ensure you
        upload proof of payment. Approval may take 24–48 hours.
      </p>
      <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium">
        Upload Proof & Confirm
      </button>
    </div>
  );
}
