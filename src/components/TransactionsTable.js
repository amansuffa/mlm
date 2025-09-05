"use client";
import useSWR from "swr";

const fetcher = (url) => fetch(url).then((r) => r.json());

export default function TransactionsTable() {
  const { data } = useSWR("/api/transactions", fetcher);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg overflow-x-auto">
      {/* Header */}
      <h3 className="text-lg font-bold text-gray-700 mb-4">💳 Recent Transactions</h3>

      {/* Table */}
      <div className="min-w-[600px]">
        <table className="w-full text-sm table-auto border-collapse">
          <thead>
            <tr className="bg-gray-100 text-gray-600 text-left">
              <th className="p-3 font-semibold">Date</th>
              <th className="p-3 font-semibold">Name</th>
              <th className="p-3 font-semibold">Rank</th>
              <th className="p-3 font-semibold">Amount</th>
              <th className="p-3 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {data?.transactions?.map((t) => (
              <tr
                key={t.id}
                className="border-t hover:bg-gray-50 transition-colors"
              >
                <td className="p-3 text-gray-700">{t.date}</td>
                <td className="p-3 font-medium text-gray-800">{t.name}</td>
                <td className="p-3 text-gray-600">{t.rank}</td>
                <td className="p-3 font-semibold text-gray-900">${t.amount}</td>
                <td className="p-3">
                  <span
                    className={`px-3 py-1 text-xs font-medium rounded-full ${
                      t.status === "Completed"
                        ? "bg-green-100 text-green-700"
                        : t.status === "Pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {t.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
