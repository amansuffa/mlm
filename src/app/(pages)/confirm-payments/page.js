"use client";
import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import toast from "react-hot-toast";

export default function ConfirmPaymentsPage() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const { data: session } = useSession();
  const router = useRouter();
  const { theme } = useTheme();

  const fetchPendingTransactions = useCallback(async () => {
    if (!session?.user?.id) return;
    
    setLoading(true);
    try {
      const res = await fetch(`/api/transactions/pending?userId=${session.user.id}`);
      const data = await res.json();
      
      if (data.error) {
        console.error('API Error:', data.error);
        toast.error("Failed to load pending transactions");
        setTransactions([]);
      } else {
        setTransactions(data.transactions || []);
      }
    } catch (error) {
      console.error('Fetch error:', error);
      toast.error("Failed to load pending transactions");
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  }, [session?.user?.id]);

  useEffect(() => {
    if (session?.user?.id) {
      fetchPendingTransactions();
    }
  }, [session?.user?.id, fetchPendingTransactions]);

  const typeOptions = [
    { value: "all", label: "All Types" },
    { value: "admin", label: "Admin Fee" },
    { value: "membership", label: "Membership Fee" },
  ];

  const filteredTransactions = transactions.filter((tx) => {
    const matchesSearch = 
      tx.fromUser?.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.toUser?.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx._id?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || tx.type === filterType;
    return matchesSearch && matchesType;
  });

  const getTypeInfo = (type) => {
    switch (type) {
      case "admin":
        return { text: "Admin Fee", class: "bg-blue-100 text-blue-700" };
      case "membership":
        return { text: "Membership Fee", class: "bg-purple-100 text-purple-700" };
      default:
        return { text: "Other", class: "bg-gray-100 text-gray-700" };
    }
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="header rounded-2xl shadow-xl overflow-hidden">
            <div className="px-8 py-8">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                <div className="mb-6 lg:mb-0">
                  <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">
                    Pending Payments
                  </h1>
                  <p className="text-white text-opacity-90 text-lg">
                    Review and approve pending transactions
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-xl text-white">
                    <p className="text-sm opacity-90">Pending Transactions</p>
                    <p className="text-2xl font-bold">{transactions.length}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className={`grid gap-6 mb-8 ${session?.user?.role === "admin" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-4" : "grid-cols-1"}`}>
          {session?.user?.role === "admin" && (
            <div 
              className="rounded-xl shadow-lg p-6 border-l-4 hover:shadow-xl transition-all duration-300"
              style={{ 
                backgroundColor: 'var(--card)',
                borderLeftColor: 'var(--primary)',
              }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium opacity-80">Total Pending</p>
                  <p className="text-2xl font-bold mt-1" style={{ color: 'var(--text)' }}>
                    {transactions.length}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-[var(--primary)]/20">
                  <svg className="w-6 h-6" style={{ color: 'var(--primary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>
          )}

          <div 
            className="rounded-xl shadow-lg p-6 border-l-4 hover:shadow-xl transition-all duration-300"
            style={{ 
              backgroundColor: 'var(--card)',
              borderLeftColor: 'var(--secondary)',
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium opacity-80">Pending Amount</p>
                <p className="text-2xl font-bold mt-1" style={{ color: 'var(--text)' }}>
                  ${transactions.reduce((sum, tx) => sum + (tx.amount || 0), 0).toLocaleString()}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-[var(--secondary)]/20">
                <svg className="w-6 h-6" style={{ color: 'var(--secondary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
            </div>
          </div>

          {session?.user?.role === "admin" && (
            <>
              <div 
                className="rounded-xl shadow-lg p-6 border-l-4 hover:shadow-xl transition-all duration-300"
                style={{ 
                  backgroundColor: 'var(--card)',
                  borderLeftColor: 'var(--accent)',
                }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium opacity-80">Admin Fees</p>
                    <p className="text-2xl font-bold mt-1" style={{ color: 'var(--text)' }}>
                      {transactions.filter(tx => tx.type === 'admin').length}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-[var(--accent)]/20">
                    <svg className="w-6 h-6" style={{ color: 'var(--accent)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div 
                className="rounded-xl shadow-lg p-6 border-l-4 hover:shadow-xl transition-all duration-300"
                style={{ 
                  backgroundColor: 'var(--card)',
                  borderLeftColor: 'var(--success)',
                }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium opacity-80">Membership Fees</p>
                    <p className="text-2xl font-bold mt-1" style={{ color: 'var(--text)' }}>
                      {transactions.filter(tx => tx.type === 'membership').length}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-[var(--success)]/20">
                    <svg className="w-6 h-6" style={{ color: 'var(--success)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Filters and Search */}
        <div 
          className="rounded-xl shadow-lg p-6 mb-6"
          style={{ 
            backgroundColor: 'var(--card)',
            border: `1px solid var(--border)`
          }}
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search pending transactions by user, ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onFocus={(e) => e.target.style.borderColor = 'var(--accent)'}
                  onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
                  className="card-secondary w-full rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-1"
                  style={{
                    '--tw-ring-color': 'var(--accent)'
                  }}
                />
                <svg
                  className="absolute left-3 top-3.5 w-5 h-5"
                  style={{ color: 'var(--primary)' }}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            <div className="flex space-x-4">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                onFocus={(e) => e.target.style.borderColor = 'var(--accent)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
                className="card-secondary rounded-xl px-4 py-3 focus:outline-none focus:ring-1"
                style={{
                  '--tw-ring-color': 'var(--accent)'
                }}
              >
                {typeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Transactions Table */}
        {loading ? (
          <div className="card rounded-xl shadow-lg p-12 text-center">
            <div 
              className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto"
              style={{ borderColor: 'var(--primary)' }}
            ></div>
            <p className="mt-4 text-lg opacity-80">Loading pending transactions...</p>
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div 
            className="rounded-xl shadow-lg p-12 text-center"
            style={{ 
              backgroundColor: 'var(--card)',
              border: `1px solid var(--border)`
            }}
          >
            <div 
              className="w-24 h-24 rounded-full bg-[var(--primary)}]/20  flex items-center justify-center mx-auto mb-4"
      
            >
              <svg
                className="w-12 h-12"
                style={{ color: 'var(--primary)' }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--text)' }}>
              No Pending Transactions
            </h3>
            <p className="mb-6 opacity-80">
              {searchTerm || filterType !== "all"
                ? "Try adjusting your search or filters"
                : "All transactions have been processed and approved!"}
            </p>
            <div className="text-4xl mb-4">🎉</div>
          </div>
        ) : (
          <div className="card rounded-xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ backgroundColor: `var(--cardSecondary)` }}>
                    <th className="text-left py-4 px-6 font-semibold">Date & Time</th>
                    <th className="text-left py-4 px-6 font-semibold">From User</th>
                    <th className="text-left py-4 px-6 font-semibold">To User</th>
                    <th className="text-left py-4 px-6 font-semibold">Amount</th>
                    <th className="text-left py-4 px-6 font-semibold">Type</th>
                    <th className="text-left py-4 px-6 font-semibold">Status</th>
                    <th className="text-center py-4 px-6 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.map((tx, index) => {
                    const typeInfo = getTypeInfo(tx.type);
                    return (
                      <tr 
                        key={tx._id} 
                        className="transition-colors duration-200 hover:opacity-90"
                        style={{ 
                          borderBottom: index !== filteredTransactions.length - 1 ? `1px solid var(--border)` : 'none',
                          backgroundColor: `transparent`
                        }}
                      >
                        <td className="py-4 px-6">
                          <div>
                            <p className="font-medium" style={{ color: 'var(--text)' }}>
                              {new Date(tx.createdAt).toLocaleDateString()}
                            </p>
                            <p className="text-sm opacity-70">
                              {new Date(tx.createdAt).toLocaleTimeString()}
                            </p>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <p className="font-medium" style={{ color: 'var(--text)' }}>
                            {tx.fromUser?.username || "N/A"}
                          </p>
                          {tx.fromUser?.email && (
                            <p className="text-sm opacity-70">{tx.fromUser.email}</p>
                          )}
                        </td>
                        <td className="py-4 px-6">
                          <p className="font-medium" style={{ color: 'var(--text)' }}>
                            {tx.toUser?.username || "N/A"}
                          </p>
                          {tx.toUser?.email && (
                            <p className="text-sm opacity-70">{tx.toUser.email}</p>
                          )}
                        </td>
                        <td className="py-4 px-6">
                          <p className="text-xl font-bold text-green-600">${tx.amount}</p>
                        </td>
                        <td className="py-4 px-6">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${typeInfo.class}`}>
                            {typeInfo.text}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700">
                            PENDING REVIEW
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex justify-center">
                            <button
                              onClick={() => router.push(`/transactions/${tx._id}?from=confirm-payments`)}
                              className="p-2 transition-all duration-200 hover:opacity-70 flex items-center justify-center"
                              style={{ color: 'var(--accent)' }}
                              title="Review"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}