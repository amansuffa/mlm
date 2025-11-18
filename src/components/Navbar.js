"use client";
import Link from "next/link";
import Logout from "./Logout";
import Image from "next/image";
import { useState } from "react";
import logo from "../assets/logo.png";
import ThemeToggleButton from "./ThemeToggleButton";
import { useSession } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav
      className="sticky top-0 z-50 transition-colors duration-300"
      style={{
        backgroundColor: "var(--background)",
        borderBottom: "1px solid var(--border)",
        backdropFilter: "blur(10px)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left Side - Logo & Navigation Links */}
          <div className="flex items-center gap-8">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="flex justify-center overflow-hidden h-full">
                  <Image
                    className="object-cover mb-1"
                    src={logo}
                    alt="Logo"
                    width={180}
                    height={48}
                    priority
                  />
                </div>

                {/* <span 
                  className="text-xl font-bold hidden sm:block"
                  style={{ color: 'var(--text)' }}
                >
                  PASH.CLUB
                </span> */}
              </div>
            </Link>

            {/* Navigation Links - Desktop */}
            <div className="hidden md:flex items-center gap-6">
              <Link
                href="/"
                className="font-medium transition-all duration-200 hover:opacity-80"
                style={{ color: "var(--text)" }}
              >
                Home
              </Link>
              {/* <Link 
                href="/products" 
                className="font-medium transition-all duration-200 hover:opacity-80"
                style={{ color: 'var(--text)' }}
              >
                Products
              </Link>
              <Link 
                href="/mission" 
                className="font-medium transition-all duration-200 hover:opacity-80"
                style={{ color: 'var(--text)' }}
              >
                Mission
              </Link> */}
              <Link
                href="/blogs"
                className="font-medium transition-all duration-200 hover:opacity-80"
                style={{ color: "var(--text)" }}
              >
                Blog
              </Link>
              {/* <Link 
                href="/contact" 
                className="font-medium transition-all duration-200 hover:opacity-80"
                style={{ color: 'var(--text)' }}
              >
                Contact
              </Link> */}
              {session?.user && (
                <Link
                  href="/dashboard"
                  className="font-medium transition-all duration-200 hover:opacity-80"
                  style={{ color: "var(--text)" }}
                >
                  Dashboard
                </Link>
              )}
            </div>
          </div>

          {/* Right Side - Actions */}
          <div className="flex items-center gap-4">
            {/* Theme Toggle */}
            <ThemeToggleButton />

            {/* Auth Buttons - Desktop */}
            <div className="hidden sm:flex items-center gap-3">
              {!session?.user ? (
                <>
                  <Link href="/login">
                    <button
                      className="px-4 py-2 font-medium rounded-lg transition-all duration-200 hover:shadow-lg"
                      style={{
                        color: "var(--accent)",
                        border: "1px solid var(--accent)",
                        backgroundColor: "transparent",
                      }}
                    >
                      Log In
                    </button>
                  </Link>
                  <Link href="/signup">
                    <button className="button px-4 py-2 font-medium rounded-lg transition-all duration-200 hover:shadow-lg">
                      Join now
                    </button>
                  </Link>
                </>
              ) : (
                <div className="flex items-center gap-4">
                  <Logout />
                  <Link href="/user/profile" className="hidden md:block">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold text-sm overflow-hidden"
                      style={{ backgroundColor: "var(--primary)" }}
                    >
                      {session.user.profilePicture ? (
                        <Image
                          src={session.user.profilePicture}
                          alt={session.user.name || "User"}
                          width={32}
                          height={32}
                          className="w-full h-full object-cover"
                          priority
                        />
                      ) : (
                        session.user.name?.charAt(0) ||
                        session.user.email?.charAt(0) ||
                        "U"
                      )}
                    </div>
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 rounded-lg transition-colors duration-200"
              style={{
                backgroundColor: "var(--card)",
                color: "var(--text)",
              }}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div
            className="md:hidden absolute top-16 left-0 right-0 shadow-lg border-t"
            style={{
              backgroundColor: "var(--background)",
              borderColor: "var(--border)",
            }}
          >
            <div className="px-4 py-3 space-y-3">
              <Link
                href="/"
                className="block py-2 px-4 rounded-lg font-medium transition-colors duration-200"
                style={{
                  backgroundColor: "var(--card)",
                  color: "var(--text)",
                }}
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              {/* <Link 
                href="/products" 
                className="block py-2 px-4 rounded-lg font-medium transition-colors duration-200"
                style={{ 
                  backgroundColor: 'var(--card)',
                  color: 'var(--text)'
                }}
                onClick={() => setIsMenuOpen(false)}
              >
                Products
              </Link>
              <Link 
                href="/mission" 
                className="block py-2 px-4 rounded-lg font-medium transition-colors duration-200"
                style={{ 
                  backgroundColor: 'var(--card)',
                  color: 'var(--text)'
                }}
                onClick={() => setIsMenuOpen(false)}
              >
                Mission
              </Link> */}
              <Link
                href="/blogs"
                className="block py-2 px-4 rounded-lg font-medium transition-colors duration-200"
                style={{
                  backgroundColor: "var(--card)",
                  color: "var(--text)",
                }}
                onClick={() => setIsMenuOpen(false)}
              >
                Blog
              </Link>
              {/* <Link 
                href="/contact" 
                className="block py-2 px-4 rounded-lg font-medium transition-colors duration-200"
                style={{ 
                  backgroundColor: 'var(--card)',
                  color: 'var(--text)'
                }}
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link> */}
              {session?.user && (
                <Link
                  href="/dashboard"
                  className="block py-2 px-4 rounded-lg font-medium transition-colors duration-200"
                  style={{
                    backgroundColor: "var(--card)",
                    color: "var(--text)",
                  }}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
              )}

              {/* Mobile Auth Buttons */}
              <div
                className="pt-3 border-t"
                style={{ borderColor: "var(--border)" }}
              >
                {!session?.user ? (
                  <div className="flex flex-col gap-2">
                    <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                      <button
                        className="w-full py-2 px-4 font-medium rounded-lg transition-all duration-200"
                        style={{
                          color: "var(--primary)",
                          border: "1px solid var(--primary)",
                          backgroundColor: "transparent",
                        }}
                      >
                        Log In
                      </button>
                    </Link>
                    <Link href="/signup" onClick={() => setIsMenuOpen(false)}>
                      <button
                        className="w-full py-2 px-4 font-medium rounded-lg transition-all duration-200"
                        style={{
                          backgroundColor: "var(--primary)",
                          color: "var(--background)",
                        }}
                      >
                        Join now
                      </button>
                    </Link>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Link href="/user/profile">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold text-sm overflow-hidden"
                          style={{ backgroundColor: "var(--primary)" }}
                        >
                          {session.user.profilePicture ? (
                            <Image
                              src={session.user.profilePicture}
                              alt={session.user.name || "User"}
                              width={32}
                              height={32}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            session.user.name?.charAt(0) ||
                            session.user.email?.charAt(0) ||
                            "U"
                          )}
                        </div>
                      </Link>
                      <span style={{ color: "var(--text)" }}>
                        {session.user.name || session.user.email}
                      </span>
                    </div>
                    <Logout />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
