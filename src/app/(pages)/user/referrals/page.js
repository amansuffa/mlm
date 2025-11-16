"use client";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import toast from "react-hot-toast";

export default function ReferralsPage() {
  const [referralData, setReferralData] = useState({
    username: "",
    referralLink: "",
    referrals: []
  });
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const { theme } = useTheme();

  useEffect(() => {
    async function fetchReferrals() {
      try {
        setLoading(true);
        const res = await fetch("/api/referrals");
        const data = await res.json();

        if (res.ok) {
          setReferralData({
            username: data.referralId, 
            referralLink: `${window.location.origin}/signup?ref=${data.referralId}`,
            referrals: data.referrals
          });
        }
      } catch (err) {
        console.error("Failed to load referrals", err);
        toast.error("Failed to load referral data");
      } finally {
        setLoading(false);
      }
    }
    fetchReferrals();
  }, []);

  const copyLink = () => {
    navigator.clipboard.writeText(referralData.referralLink);
    setCopied(true);
    toast.success("Referral link copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "free", label: "Free" },
    { value: "admin_fee_paid", label: "Admin Fee Paid" },
    { value: "membership_paid", label: "Membership Paid" },
    { value: "fully_active", label: "Fully Active" },
  ];

  const filteredReferrals = referralData.referrals.filter((ref) => {
    const matchesSearch = 
      ref.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ref.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ref.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || ref.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusInfo = (status) => {
    switch (status) {
      case "free":
        return { text: "Free Member", class: "bg-gray-100 text-gray-700" };
      case "admin_fee_paid":
        return { text: "Admin Fee Paid", class: "bg-yellow-100 text-yellow-700" };
      case "membership_paid":
        return { text: "Membership Paid", class: "bg-blue-100 text-blue-700" };
      case "fully_active":
        return { text: "Fully Active", class: "bg-green-100 text-green-700" };
      default:
        return { text: "Free", class: "bg-gray-100 text-gray-700" };
    }
  };

  const openProfileModal = (user) => {
    setSelectedUser(user);
    setShowProfileModal(true);
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
                    My Referrals
                  </h1>
                  <p className="text-white text-opacity-90 text-lg">
                    Track and manage your referral network
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-xl text-white">
                    <p className="text-sm opacity-90">Total Referrals</p>
                    <p className="text-2xl font-bold">{referralData.referrals.length}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div 
            className="rounded-xl shadow-lg p-6 border-l-4 hover:shadow-xl transition-all duration-300"
            style={{ 
              backgroundColor: 'var(--card)',
              borderLeftColor: 'var(--primary)',
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium opacity-80">Total Referrals</p>
                <p className="text-2xl font-bold mt-1" style={{ color: 'var(--text)' }}>
                  {referralData.referrals.length}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-[var(--primary)]/20">
                <svg className="w-6 h-6" style={{ color: 'var(--primary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div 
            className="rounded-xl shadow-lg p-6 border-l-4 hover:shadow-xl transition-all duration-300"
            style={{ 
              backgroundColor: 'var(--card)',
              borderLeftColor: 'var(--secondary)',
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium opacity-80">Active Members</p>
                <p className="text-2xl font-bold mt-1" style={{ color: 'var(--text)' }}>
                  {referralData.referrals.filter(r => r.status === 'fully_active').length}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-[var(--secondary)]/20">
                <svg className="w-6 h-6" style={{ color: 'var(--secondary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
            </div>
          </div>

          <div 
            className="rounded-xl shadow-lg p-6 border-l-4 hover:shadow-xl transition-all duration-300"
            style={{ 
              backgroundColor: 'var(--card)',
              borderLeftColor: 'var(--accent)',
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium opacity-80">New This Month</p>
                <p className="text-2xl font-bold mt-1" style={{ color: 'var(--text)' }}>
                  {referralData.referrals.filter(r => {
                    const joinDate = new Date(r.createdAt);
                    const currentMonth = new Date().getMonth();
                    const currentYear = new Date().getFullYear();
                    return joinDate.getMonth() === currentMonth && joinDate.getFullYear() === currentYear;
                  }).length}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-[var(--accent)]/20">
                <svg className="w-6 h-6" style={{ color: 'var(--accent)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Referral Link Card */}
        <div 
          className="rounded-xl shadow-lg p-6 mb-8"
          style={{ 
            backgroundColor: 'var(--card)',
            border: `1px solid var(--border)`
          }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4" style={{ color: 'var(--text)' }}>
                Your Referral Information
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm opacity-80 mb-1">Your Referral ID</p>
                  <p className="text-lg font-semibold" style={{ color: 'var(--primary)' }}>
                    {referralData.username || "Loading..."}
                  </p>
                </div>
                <div>
                  <p className="text-sm opacity-80 mb-2">Share your referral link</p>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={referralData.referralLink}
                      readOnly
                      className="flex-1 card-secondary rounded-xl px-4 py-3 text-sm"
                    />
                    <button
                      onClick={copyLink}
                      className="button px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg flex items-center space-x-2"
                    >
                      {copied ? (
                        <>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <div 
              className="rounded-xl p-6"
              style={{ backgroundColor: 'var(--cardSecondary)' }}
            >
              <h4 className="font-semibold mb-3" style={{ color: 'var(--text)' }}>How It Works</h4>
              <ul className="space-y-2 text-sm opacity-90">
                <li className="flex items-center space-x-2">
                  <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Share your unique referral link with friends</span>
                </li>
                <li className="flex items-center space-x-2">
                  <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Track when people join using your link</span>
                </li>
                <li className="flex items-center space-x-2">
                  <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Monitor their membership progress</span>
                </li>
              </ul>
            </div>
          </div>
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
                  placeholder="Search referrals by name, username, or email..."
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
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                onFocus={(e) => e.target.style.borderColor = 'var(--accent)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
                className="card-secondary rounded-xl px-4 py-3 focus:outline-none focus:ring-1"
                style={{
                  '--tw-ring-color': 'var(--accent)'
                }}
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Referrals Table */}
        {loading ? (
          <div className="card rounded-xl shadow-lg p-12 text-center">
            <div 
              className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto"
              style={{ borderColor: 'var(--primary)' }}
            ></div>
            <p className="mt-4 text-lg opacity-80">Loading your referrals...</p>
          </div>
        ) : filteredReferrals.length === 0 ? (
          <div 
            className="rounded-xl shadow-lg p-12 text-center"
            style={{ 
              backgroundColor: 'var(--card)',
              border: `1px solid var(--border)`
            }}
          >
            <div 
              className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ backgroundColor: 'var(--primary)', opacity: '0.1' }}
            >
              <svg
                className="w-12 h-12"
                style={{ color: 'var(--primary)' }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--text)' }}>
              No referrals found
            </h3>
            <p className="mb-6 opacity-80">
              {searchTerm || filterStatus !== "all"
                ? "Try adjusting your search or filters"
                : "Start sharing your referral link to grow your network!"}
            </p>
            <button
              onClick={copyLink}
              className="px-8 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl inline-flex items-center space-x-2"
              style={{ 
                background: `linear-gradient(135deg, var(--primary), var(--secondary))`,
                color: 'white'
              }}
            >
              <span>Copy Referral Link</span>
            </button>
          </div>
        ) : (
          <div className="card rounded-xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ backgroundColor: `var(--cardSecondary)` }}>
                    <th className="text-left py-4 px-6 font-semibold">Member</th>
                    <th className="text-left py-4 px-6 font-semibold">Email</th>
                    <th className="text-left py-4 px-6 font-semibold">Status</th>
                    <th className="text-left py-4 px-6 font-semibold">Join Date</th>
                    <th className="text-center py-4 px-6 font-semibold w-24">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredReferrals.map((referral, index) => {
                    const statusInfo = getStatusInfo(referral.status);
                    return (
                      <tr 
                        key={referral._id || index} 
                        className="transition-colors duration-200 hover:opacity-90"
                        style={{ 
                          borderBottom: index !== filteredReferrals.length - 1 ? `1px solid var(--border)` : 'none',
                          backgroundColor: `transparent`
                        }}
                      >
                        <td className="py-4 px-6">
                          <div>
                            <p className="font-medium" style={{ color: 'var(--text)' }}>
                              {referral.name}
                            </p>
                            <p className="text-sm opacity-70">@{referral.username}</p>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <p className="opacity-90">{referral.email}</p>
                        </td>
                        <td className="py-4 px-6">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusInfo.class}`}>
                            {statusInfo.text}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <p className="opacity-90">
                            {referral.createdAt ? new Date(referral.createdAt).toLocaleDateString() : "N/A"}
                          </p>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex justify-center">
                            <button
                              onClick={() => openProfileModal(referral)}
                              className="p-2 transition-all duration-200 hover:opacity-70 flex items-center justify-center"
                              style={{ color: 'var(--accent)' }}
                              title="View Profile"
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

        {/* Profile Modal */}
        {showProfileModal && selectedUser && (
          <div className="fixed inset-0 backdrop-blur-sm bg-white/10 flex items-center justify-center z-50 p-4">
            <div 
              className="rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
              style={{ backgroundColor: 'var(--card)' }}
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>User Profile</h2>
                  <button
                    onClick={() => setShowProfileModal(false)}
                    className="p-2 hover:opacity-70 transition-opacity"
                    style={{ color: 'var(--text)' }}
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="text-center mb-6">
                  {selectedUser.profilePicture ? (
                    <img 
                      src={selectedUser.profilePicture}
                      alt={selectedUser.name}
                      className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                    />
                  ) : (
                    <div 
                      className="w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl font-bold text-white"
                      style={{ backgroundColor: 'var(--primary)' }}
                    >
                      {selectedUser.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                  )}
                  <h3 className="text-xl font-semibold mb-1" style={{ color: 'var(--text)' }}>
                    {selectedUser.name}
                  </h3>
                  <p className="opacity-70">@{selectedUser.username}</p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <svg className="w-5 h-5" style={{ color: 'var(--primary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span>{selectedUser.email}</span>
                  </div>

                  <div className="flex items-center space-x-3">
                    <svg className="w-5 h-5" style={{ color: 'var(--primary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0h6m-6 0l-2 2m8-2l2 2m-2-2v6a2 2 0 01-2 2H10a2 2 0 01-2-2v-6" />
                    </svg>
                    <span>{getStatusInfo(selectedUser.status).text}</span>
                  </div>

                  <div className="flex items-center space-x-3">
                    <svg className="w-5 h-5" style={{ color: 'var(--primary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0h6m-6 0l-2 2m8-2l2 2m-2-2v6a2 2 0 01-2 2H10a2 2 0 01-2-2v-6" />
                    </svg>
                    <span>Joined {selectedUser.createdAt ? new Date(selectedUser.createdAt).toLocaleDateString() : "N/A"}</span>
                  </div>
                </div>

                <div className="mt-6 pt-6" style={{ borderTop: `1px solid var(--border)` }}>
                  <h4 className="font-semibold mb-3" style={{ color: 'var(--text)' }}>Social Links</h4>
                  <div className="grid grid-cols-4 gap-3">
                    {/* Email */}
                    <a
                      href={`mailto:${selectedUser.email}`}
                      className="p-3 rounded-lg transition-all duration-200 hover:opacity-70 flex items-center justify-center"
                      style={{ backgroundColor: 'var(--cardSecondary)', color: '#EA4335' }}
                      title="Send Email"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-.904.732-1.636 1.636-1.636h3.819v.273L12 8.91l6.545-4.816v-.273h3.819c.904 0 1.636.732 1.636 1.636z"/>
                      </svg>
                    </a>

                    {/* Facebook */}
                    {selectedUser.socialMedia?.facebook && selectedUser.socialMedia.facebook.trim() !== '' ? (
                      <a
                        href={selectedUser.socialMedia.facebook.startsWith('http') ? selectedUser.socialMedia.facebook : `https://facebook.com/${selectedUser.socialMedia.facebook}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 rounded-lg transition-all duration-200 hover:opacity-70 flex items-center justify-center"
                        style={{ backgroundColor: 'var(--cardSecondary)', color: '#1877F2' }}
                        title="Facebook"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                      </a>
                    ) : (
                      <div className="p-3 rounded-lg opacity-30 flex items-center justify-center" style={{ backgroundColor: 'var(--cardSecondary)', color: '#1877F2' }}>
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                      </div>
                    )}

                    {/* Instagram */}
                    {selectedUser.socialMedia?.instagram && selectedUser.socialMedia.instagram.trim() !== '' ? (
                      <a
                        href={selectedUser.socialMedia.instagram.startsWith('http') ? selectedUser.socialMedia.instagram : `https://instagram.com/${selectedUser.socialMedia.instagram}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 rounded-lg transition-all duration-200 hover:opacity-70 flex items-center justify-center"
                        style={{ backgroundColor: 'var(--cardSecondary)', color: '#E4405F' }}
                        title="Instagram"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                        </svg>
                      </a>
                    ) : (
                      <div className="p-3 rounded-lg opacity-30 flex items-center justify-center" style={{ backgroundColor: 'var(--cardSecondary)', color: '#E4405F' }}>
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                        </svg>
                      </div>
                    )}

                    {/* TikTok */}
                    {selectedUser.socialMedia?.tiktok && selectedUser.socialMedia.tiktok.trim() !== '' ? (
                      <a
                        href={selectedUser.socialMedia.tiktok.startsWith('http') ? selectedUser.socialMedia.tiktok : `https://tiktok.com/@${selectedUser.socialMedia.tiktok}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 rounded-lg transition-all duration-200 hover:opacity-70 flex items-center justify-center"
                        style={{ backgroundColor: 'var(--cardSecondary)', color: '#000000' }}
                        title="TikTok"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                        </svg>
                      </a>
                    ) : (
                      <div className="p-3 rounded-lg opacity-30 flex items-center justify-center" style={{ backgroundColor: 'var(--cardSecondary)', color: '#000000' }}>
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                        </svg>
                      </div>
                    )}

                    {/* WhatsApp */}
                    {selectedUser.socialMedia?.whatsapp && selectedUser.socialMedia.whatsapp.trim() !== '' ? (
                      <a
                        href={`https://wa.me/${selectedUser.socialMedia.whatsapp}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 rounded-lg transition-all duration-200 hover:opacity-70 flex items-center justify-center"
                        style={{ backgroundColor: 'var(--cardSecondary)', color: '#25D366' }}
                        title="WhatsApp"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.488"/>
                        </svg>
                      </a>
                    ) : (
                      <div className="p-3 rounded-lg opacity-30 flex items-center justify-center" style={{ backgroundColor: 'var(--cardSecondary)', color: '#25D366' }}>
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.488"/>
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}