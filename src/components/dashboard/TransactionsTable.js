"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function TransactionsTable() {
  const [transactions, setTransactions] = useState([]);
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/transactions");
        const data = await res.json();
        setTransactions(data.transactions || data || []);
      } catch (err) {
        console.error("Error fetching transactions:", err);
      }
    }
    fetchData();
  }, []);

  // Sort by newest first and take top 5
  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  return (
    <div className="card p-6 rounded-2xl shadow-lg overflow-x-auto">
      <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--text)' }}>💳 Recent Transactions</h3>

      <div className="min-w-[700px]">
        <table className="w-full text-sm table-auto border-collapse">
          <thead>
            <tr className="card-secondary text-left" style={{ color: 'var(--textSecondary)' }}>
              <th className="p-3 font-semibold">Date</th>
              <th className="p-3 font-semibold">From</th>
              <th className="p-3 font-semibold">To</th>
              <th className="p-3 font-semibold">Amount</th>
              <th className="p-3 font-semibold">Type</th>
              <th className="p-3 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {recentTransactions.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center p-3" style={{ color: 'var(--textSecondary)' }}>
                  No recent transactions
                </td>
              </tr>
            ) : (
              recentTransactions.map((t) => (
                <tr key={t._id} className="hover:opacity-80 transition-colors" style={{ borderTop: '1px solid var(--border)' }}>
                  <td className="p-3" style={{ color: 'var(--text)' }}>
                    {new Date(t.createdAt).toLocaleString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="p-3 font-medium" style={{ color: 'var(--text)' }}>{t.fromUser?.username || "N/A"}</td>
                  <td className="p-3 font-medium" style={{ color: 'var(--text)' }}>{t.toUser?.username || "N/A"}</td>
                  <td className="p-3" style={{ color: 'var(--textSecondary)' }}>${t.amount}</td>
                  <td className="p-3 font-semibold" style={{ color: 'var(--text)' }}>{t.type}</td>
                  <td className="p-3">
                    <span
                      className={`px-3 py-1 text-xs font-medium rounded-full ${
                        t.status === "completed"
                          ? "bg-green-100 text-green-700"
                          : t.status === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {t.status || "N/A"}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {/* Show All Button */}
      {transactions.length > 0 && (
        <div className="mt-4 text-center">
          <button
            onClick={() => router.push('/transactions')}
            className="px-4 py-2 text-sm font-medium rounded-lg transition-colors"
            style={{ color: 'var(--accent)' }}
            onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--cardSecondary)'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
          >
            Show All
          </button>
        </div>
      )}
    </div>
  );
}
