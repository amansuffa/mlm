"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FaTachometerAlt,
  FaUser,
  FaUsers,
  FaUserFriends,
  FaWallet,
  FaClipboardList,
  FaExchangeAlt,
  FaUserCog,
} from "react-icons/fa";

export default function Sidebar({ isOpen, setIsOpen }) {
  const pathname = usePathname();

  const links = [
    { href: "/dashboard", label: "Dashboard", icon: <FaTachometerAlt /> },
    { href: "/profile", label: "Profile", icon: <FaUser /> },
    { href: "/downline", label: "Downline", icon: <FaUsers /> },
    { href: "/referrals", label: "My Referrals", icon: <FaUserFriends /> },
    { href: "/withdrawal", label: "Withdrawal", icon: <FaWallet /> },
    { href: "/plans", label: "Plans", icon: <FaClipboardList /> },
    { href: "/transactions", label: "Transactions", icon: <FaExchangeAlt /> },
    { href: "/manage-users", label: "Manage Users", icon: <FaUserCog /> },
  ];

  return (
    <>
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 min-h-screen w-64 p-6 flex flex-col z-40 transform transition-transform duration-300
        bg-gradient-to-b from-gray-900 via-gray-800 to-gray-950 text-white shadow-2xl
        ${isOpen ? "translate-x-0" : "-translate-x-full"} 
        md:translate-x-0 md:static md:block`}
      >
        {/* Close button (only visible on mobile) */}
        <button
          className="md:hidden self-end mb-6 text-gray-300 hover:text-white"
          onClick={() => setIsOpen(false)}
        >
          ✕
        </button>

        {/* Logo / Brand */}
        <div className="mb-8 flex items-center gap-2">
          <div className="h-10 w-10 bg-gradient-to-r from-gray-700 to-gray-600 rounded-lg flex items-center justify-center font-bold text-lg shadow-md">
            A
          </div>
          <h1 className="text-xl font-bold text-white">Admin Panel</h1>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-2">
          {links.map(({ href, label, icon }) => (
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
              {label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Overlay (mobile only) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </>
  );
}
