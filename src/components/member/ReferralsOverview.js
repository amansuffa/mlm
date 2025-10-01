"use client";

export default function ReferralsOverview() {
  // Dummy data — fetch from API in real app
  const referrals = [
    { name: "Ali Raza", username: "ali123", joinDate: "2025-09-12", status: "Active" },
    { name: "Sara Khan", username: "sarak", joinDate: "2025-09-15", status: "Pending" },
    { name: "John Doe", username: "john77", joinDate: "2025-09-20", status: "Active" },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h3 className="text-lg font-bold text-gray-700 mb-4">
        👥 My Direct Referrals
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead>
            <tr className="bg-gray-100 text-gray-600 uppercase text-xs">
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
                className="border-b last:border-0 hover:bg-gray-50 transition"
              >
                <td className="px-4 py-2 font-medium">{ref.name}</td>
                <td className="px-4 py-2">{ref.username}</td>
                <td className="px-4 py-2">{ref.joinDate}</td>
                <td className="px-4 py-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      ref.status === "Active"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {ref.status}
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
