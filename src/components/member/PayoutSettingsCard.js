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
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-lg font-bold text-gray-700 mb-3">💰 Payout Settings</h3>
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

 

  const primaryMethod = payouts.find((m) => m.isPrimary);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h3 className="text-lg font-bold text-gray-700 mb-3">💰 Payout Settings</h3>

      {primaryMethod ? (
        <p className="text-gray-700">
          Primary Method:{" "}
          <span className="font-semibold capitalize">{primaryMethod.type}</span>
        </p>
      ) : (
        <p className="text-red-500 text-sm">
          ⚠ No payout method added. Please set one in your profile.
        </p>
      )}

      <button
        onClick={() => (window.location.href = "/dashboard/payout-settings")}
        className="mt-4 px-4 py-2 rounded-lg bg-gradient-to-r from-green-500 to-green-600 text-white font-medium"
      >
        Manage Payout Methods
      </button>
    </div>
  );
}
