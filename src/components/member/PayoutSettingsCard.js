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
      <div className="card rounded-2xl shadow-lg p-6">
        <h3 className="text-lg font-bold mb-3" style={{ color: 'var(--text)' }}>💰 Payout Settings</h3>
        <p style={{ color: 'var(--textSecondary)' }}>Loading...</p>
      </div>
    );
  }

 

  const primaryMethod = payouts.find((m) => m.isPrimary);

  return (
    <div className="card rounded-2xl shadow-lg p-6">
      <h3 className="text-lg font-bold mb-3" style={{ color: 'var(--text)' }}>💰 Payout Settings</h3>

      {primaryMethod ? (
        <p style={{ color: 'var(--text)' }}>
          Primary Method:{" "}
          <span className="font-semibold capitalize">{primaryMethod.methodName}</span>
        </p>
      ) : (
        <p className="text-sm" style={{ color: 'var(--error)' }}>
          ⚠ No payout method added. Please set one in your profile.
        </p>
      )}

      <button
        onClick={() => (window.location.href = "/dashboard/payout-settings")}
        className="button mt-4 px-4 py-2 rounded-lg text-white font-medium"
      >
        Manage Payout Methods
      </button>
    </div>
  );
}
