"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import {
  FaClipboardList,
  FaEnvelope,
  FaExchangeAlt,
  FaTachometerAlt,
  FaUser,
  FaUserCog,
  FaUserFriends,
  FaUsers,
  FaWallet,
  FaHospitalUser,
  FaCreditCard,
  FaCheckCircle,
} from "react-icons/fa";

export default function Sidebar({ isOpen, setIsOpen, status, role }) {
  const pathname = usePathname();
  const [pendingCount, setPendingCount] = useState(0);
  const { data: session } = useSession();

  console.log("Sidebar Status:", status, "Role:", role);

  // Fetch pending transactions count
  const fetchPendingCount = useCallback(async () => {
    if (!session?.user?.id) return;
    
    try {
      const response = await fetch(`/api/transactions/pending?userId=${session.user.id}`);
      if (response.ok) {
        const data = await response.json();
        setPendingCount(data.count || 0);
      }
    } catch (error) {
      console.error('Error fetching pending count:', error);
    }
  }, [session?.user?.id]);

  // Real-time updates
  useEffect(() => {
    if (status === 'fully_active' && session?.user?.id) {
      fetchPendingCount();
      const interval = setInterval(fetchPendingCount, 30000); // Update every 30 seconds
      
      // Listen for immediate updates
      const handleUpdate = () => fetchPendingCount();
      window.addEventListener('pendingTransactionUpdate', handleUpdate);
      
      return () => {
        clearInterval(interval);
        window.removeEventListener('pendingTransactionUpdate', handleUpdate);
      };
    }
  }, [status, session?.user?.id, fetchPendingCount]);

  const allLinks = [
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: <FaTachometerAlt />,
      statuses: ["free", "admin_fee_paid", "membership_paid", "fully_active"],
    },
    {
      href: "/user/profile",
      label: "Profile",
      icon: <FaUser />,
      statuses: ["free", "admin_fee_paid", "membership_paid", "fully_active"],
    },
    {
      href: "/dashboard/payout-settings",
      label: "Payout Settings",
      icon: <FaCreditCard />,
      statuses: ["fully_active"],
    },
    {
      href: "/user/downline",
      label: "Downline",
      icon: <FaUsers />,
      statuses: ["fully_active"],
    },
    {
      href: "/user/referrals",
      label: "My Referrals",
      icon: <FaUserFriends />,
      statuses: ["fully_active"],
    },
    {
      href: "/transactions",
      label: "Transactions",
      icon: <FaExchangeAlt />,
      statuses: ["fully_active"],
    },
    {
      href: "/confirm-payments",
      label: "Pending Transactions",
      icon: <FaCheckCircle />,
      statuses: ["fully_active"],
    },
    // 👇 Admin-only links
    {
      href: "/blog-editor",
      label: "Blog Editor",
      icon: <FaClipboardList />,
      roles: ["admin"],
    },
    {
      href: "/email-templates",
      label: "Email Templates",
      icon: <FaEnvelope />,
      roles: ["admin"],
    },
    {
      href: "/manage-users",
      label: "Manage Users",
      icon: <FaUserCog />,
      roles: ["admin"],
    },
  ];

  // ✅ Filter logic: show link if
  // - it has a matching status (if defined), and
  // - it has a matching role (if defined)
  const filteredLinks = allLinks.filter((link) => {
    const statusAllowed =
      !link.statuses || link.statuses.includes(status);
    const roleAllowed =
      !link.roles || link.roles.includes(role);
    return statusAllowed && roleAllowed;
  });

  return (
    <>
      <aside
        className={`sidebar fixed top-0 left-0 min-h-screen w-64 p-6 border-r border-t border-[var(--border)] flex flex-col z-40 transform transition-transform duration-300 text-white shadow-2xl
        ${isOpen ? "translate-x-0" : "-translate-x-full"} 
        md:translate-x-0 md:static md:block`}
      >
        <button
          className="md:hidden self-end mb-6 text-gray-300 hover:text-white"
          onClick={() => setIsOpen(false)}
        >
          ✕
        </button>

        <div className="mb-8 flex items-center gap-2">
          <div className="h-10 w-10 bg-gradient-to-r from-gray-700 to-gray-600 rounded-lg flex items-center justify-center font-bold text-lg shadow-md">
            A
          </div>
          <h1 className="text-xl font-bold text-white">
            {role === "admin" ? "Admin Panel" : "Client Dashboard"}
          </h1>
        </div>

        <nav className="flex flex-col gap-2">
          {filteredLinks.map(({ href, label, icon }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-3 px-4 py-2 rounded-xl font-medium transition-colors
              ${
                pathname === href
                  ? "bg-gradient-to-r from-gray-700 to-gray-600 text-white shadow-md"
                  : "text-gray-300 hover:bg-white/10 hover:text-white"
              }`}
            >
              {icon}
              <span className="flex-1">{label}</span>
              {href === "/confirm-payments" && pendingCount > 0 && (
                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full min-w-[20px] text-center">
                  {pendingCount}
                </span>
              )}
            </Link>
          ))}
        </nav>
      </aside>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </>
  );
}
