"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function ReferralsOverview() {
  const [referrals, setReferrals] = useState([]);

  useEffect(() => {
    async function fetchReferrals() {
      try {
        const res = await fetch("/api/referrals");
        const data = await res.json();

        if (res.ok) {
          const recentReferrals = data.referrals
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 3)
            .map(ref => {
              let statusText = "";
              let statusClass = "";

              switch (ref.status) {
                case "free":
                  statusText = "Free";
                  statusClass = "bg-gray-100 text-gray-700";
                  break;
                case "admin_fee_paid":
                  statusText = "Admin Fee Paid";
                  statusClass = "bg-yellow-100 text-yellow-700";
                  break;
                case "membership_paid":
                  statusText = "Membership Paid";
                  statusClass = "bg-blue-100 text-blue-700";
                  break;
                case "fully_active":
                  statusText = "Fully Active";
                  statusClass = "bg-green-100 text-green-700";
                  break;
                default:
                  statusText = "Free";
                  statusClass = "bg-gray-100 text-gray-700";
              }

              return {
                name: ref.name,
                username: ref.username,
                joinDate: new Date(ref.createdAt).toLocaleDateString(),
                statusText,
                statusClass,
              };
            });

          setReferrals(recentReferrals);
        }
      } catch (err) {
        console.error("Failed to fetch referrals", err);
      }
    }

    fetchReferrals();
  }, []);

  return (
    <div className="card rounded-2xl shadow-lg p-6">
      <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--text)' }}>
        👥 My Referrals
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead>
            <tr className="card-secondary uppercase text-xs" style={{ color: 'var(--textSecondary)' }}>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Username</th>
              <th className="px-4 py-2">Join Date</th>
              <th className="px-4 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {referrals.map((ref, i) => (
              <tr
                key={i}
                className="last:border-0 hover:opacity-80 transition"
                style={{ borderBottom: '1px solid var(--border)' }}
              >
                <td className="px-4 py-2 font-medium" style={{ color: 'var(--text)' }}>{ref.name}</td>
                <td className="px-4 py-2" style={{ color: 'var(--text)' }}>{ref.username}</td>
                <td className="px-4 py-2" style={{ color: 'var(--text)' }}>{ref.joinDate}</td>
                <td className="px-4 py-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${ref.statusClass}`}>
                    {ref.statusText}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Show All Button */}
      {referrals.length > 0 && (
        <div className="mt-4 text-center">
          <Link
            href="/user/referrals"
            className="inline-block px-4 py-2 text-sm font-medium rounded-lg transition-colors"
            style={{ color: 'var(--accent)' }}
            onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--cardSecondary)'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
          >
            Show All
          </Link>
        </div>
      )}
    </div>
  );
}
