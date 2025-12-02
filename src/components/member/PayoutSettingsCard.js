"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export default function PayoutSettingsCard() {
  const { data: session, status } = useSession();

  const [payouts, setPayouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = session?.user?.id;

  useEffect(() => {
    async function fetchPayouts() {
      try {
        if (userId) {
          const res = await fetch(`/api/user/${userId}/payout-settings`);
          const data = await res.json();
          console.log("Fetched payout methods:", data);

          setPayouts(data);
        }
      } catch (err) {
        console.error("Error fetching payout methods:", err);
      } finally {
        setLoading(false);
      }
    }

    if (userId) fetchPayouts();
  }, [userId]);

  if (status === "loading" || loading) {
    return (
      <div className="card rounded-2xl shadow-lg p-6 h-full flex flex-col">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center">
            <span className="text-white text-lg">💰</span>
          </div>
          <h3 className="text-lg font-bold" style={{ color: 'var(--text)' }}>Payout Settings</h3>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-pulse flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-300 rounded-full animate-bounce"></div>
            <p style={{ color: 'var(--textSecondary)' }}>Loading...</p>
          </div>
        </div>
      </div>
    );
  }

 

  // const primaryMethod = payouts.all.find((m) => m.isPrimary);
  const primaryMethod = payouts.primary;


  return (
    <div className="card rounded-2xl shadow-lg p-6 h-full flex flex-col">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center">
          <span className="text-white text-lg">💰</span>
        </div>
        <h3 className="text-lg font-bold" style={{ color: 'var(--text)' }}>Payout Settings</h3>
      </div>

      <div className="flex flex-col h-full">
        <div className="space-y-3 flex-1">
          {primaryMethod ? (
            <div className="p-3 flex flex-col gap-4 justify-between">
              <div className="bg-[var(--cardSecondary)] p-3 rounded-lg">
              <p className="text-sm" style={{ color: 'var(--textSecondary)' }}>Primary Method</p>
              <p className="font-semibold capitalize" style={{ color: 'var(--text)' }}>
                {payouts.primary.methodName}
              </p>
              </div>
              {payouts.secondaries && payouts.secondaries.length > 0 && (
                <>
                  {payouts.secondaries.slice(0, 2).map((method, index) => (
                    <div key={index} className="bg-[var(--cardSecondary)] p-3 rounded-lg">
                    <p className="text-sm" style={{ color: 'var(--textSecondary)' }}>Secondary Method</p>
                    <p className="font-semibold capitalize" style={{ color: 'var(--text)' }}>
                      {method.methodName}
                    </p>
                    </div>
                  ))}
                </>
              )}
            </div>
          ) : (
            <div className="p-3 rounded-lg border-2 border-dashed" style={{ borderColor: 'var(--error)', backgroundColor: 'var(--cardSecondary)' }}>
              <p className="text-sm font-medium" style={{ color: 'var(--error)' }}>
                ⚠ No payout method configured
              </p>
              <p className="text-xs mt-1" style={{ color: 'var(--textSecondary)' }}>
                Add a method to receive payments
              </p>
            </div>
          )}
        </div>

        <button
          onClick={() => (window.location.href = "/dashboard/payout-settings")}
          className="button mt-4 px-4 py-2 rounded-lg text-white font-medium w-full transition-all duration-200 hover:shadow-lg"
        >
          {primaryMethod ? 'Manage Methods' : 'Add Payout Method'}
        </button>
      </div>
    </div>
  );
}
