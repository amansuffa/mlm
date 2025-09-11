"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react"; // ✅ Import hook
import {
  FaTachometerAlt,
  FaUser,
  FaUsers,
  FaUserFriends,
  FaWallet,
  FaClipboardList,
  FaExchangeAlt,
  FaUserCog,
  FaEnvelope,
} from "react-icons/fa";

export default function Sidebar({ isOpen, setIsOpen }) {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const role = session?.user?.role;

  if (status === "loading") {
    return null; // or a skeleton loader to avoid flicker
  }

  const allLinks = [
    { href: "/dashboard", label: "Dashboard", icon: <FaTachometerAlt /> },
    { href: "/profile", label: "Profile", icon: <FaUser /> },
    { href: "/downline", label: "Downline", icon: <FaUsers /> },
    { href: "/referrals", label: "My Referrals", icon: <FaUserFriends /> },
    { href: "/withdrawal", label: "Withdrawal", icon: <FaWallet /> },
    { href: "/transactions", label: "Transactions", icon: <FaExchangeAlt />, adminOnly: true },
    { href: "/blog-editor", label: "Blog Editor", icon: <FaClipboardList />, adminOnly: true },
    { href: "/email-tempelate", label: "Email Templates", icon: <FaEnvelope />, adminOnly: true },
    { href: "/manage-users", label: "Manage Users", icon: <FaUserCog />, adminOnly: true },
  ];

  const filteredLinks = allLinks.filter(link => role === "admin" || !link.adminOnly);

  return (
    <>
      <aside
        className={`fixed top-0 left-0 min-h-screen w-64 p-6 flex flex-col z-40 transform transition-transform duration-300
        bg-gradient-to-b from-gray-900 via-gray-800 to-gray-950 text-white shadow-2xl
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
              {label}
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
