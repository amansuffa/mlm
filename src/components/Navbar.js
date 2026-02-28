"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logout from "./Logout";
import Image from "next/image";
import { useState } from "react";
import logo from "../assets/logo.png";
import ThemeToggleButton from "./ThemeToggleButton";
import TranslateWidget from "./TranslateWidget";
import { useRef } from "../contexts/RefContext";
import { useSession } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { getUrlWithRef } = useRef();
  const pathname = usePathname();

  const isActive = (path) => {
    if (path === "/") return pathname === "/";
    return pathname.startsWith(path);
  };

  return (
    <nav
      className="sticky top-0 z-50 transition-colors duration-300"
      style={{
        backgroundColor: "var(--background)",
        borderBottom: "1px solid var(--border)",
        backdropFilter: "blur(10px)",
      }}
    >
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
        <div className="flex justify-between items-center h-20">
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
            <div className="hidden lg:flex items-center gap-8">
              <Link
                href={getUrlWithRef("/")}
                className={`text-base font-semibold transition-all duration-200 hover:opacity-80 pb-1 ${isActive("/") ? "border-b-2" : ""}`}
                style={{ color: isActive("/") ? "var(--primary)" : "var(--text)", borderColor: "var(--primary)" }}
              >
                Home
              </Link>
              <Link 
                href={getUrlWithRef("/about")} 
                className={`text-base font-semibold transition-all duration-200 hover:opacity-80 pb-1 ${isActive("/about") ? "border-b-2" : ""}`}
                style={{ color: isActive("/about") ? "var(--primary)" : "var(--text)", borderColor: "var(--primary)" }}
              >
                Mission
              </Link>
              <Link 
                href={getUrlWithRef("/products")} 
                className={`text-base font-semibold transition-all duration-200 hover:opacity-80 pb-1 ${isActive("/products") ? "border-b-2" : ""}`}
                style={{ color: isActive("/products") ? "var(--primary)" : "var(--text)", borderColor: "var(--primary)" }}
              >
                Resources
              </Link>
              <Link 
                href={getUrlWithRef("/partner-program")} 
                className={`text-base font-semibold transition-all duration-200 hover:opacity-80 whitespace-nowrap pb-1 ${isActive("/partner-program") ? "border-b-2" : ""}`}
                style={{ color: isActive("/partner-program") ? "var(--primary)" : "var(--text)", borderColor: "var(--primary)" }}
              >
                Partner Program
              </Link>
              <Link
                href={getUrlWithRef("/blogs")}
                className={`text-base font-semibold transition-all duration-200 hover:opacity-80 pb-1 ${isActive("/blogs") ? "border-b-2" : ""}`}
                style={{ color: isActive("/blogs") ? "var(--primary)" : "var(--text)", borderColor: "var(--primary)" }}
              >
                Training
              </Link>
              <Link 
                href={getUrlWithRef("/contact")} 
                className={`text-base font-semibold transition-all duration-200 hover:opacity-80 pb-1 ${isActive("/contact") ? "border-b-2" : ""}`}
                style={{ color: isActive("/contact") ? "var(--primary)" : "var(--text)", borderColor: "var(--primary)" }}
              >
                Contact
              </Link>
              {session?.user && (
                <Link
                  href={getUrlWithRef("/dashboard")}
                  className={`text-base font-semibold transition-all duration-200 hover:opacity-80 pb-1 ${isActive("/dashboard") ? "border-b-2" : ""}`}
                  style={{ color: isActive("/dashboard") ? "var(--primary)" : "var(--text)", borderColor: "var(--primary)" }}
                >
                  Dashboard
                </Link>
              )}
            </div>
          </div>

          {/* Right Side - Actions */}
          <div className="flex items-center gap-2">
     
            {/* Theme Toggle */}
            <ThemeToggleButton />

            {/* Auth Buttons - Desktop */}
            <div className="hidden lg:flex items-center gap-2">
            <TranslateWidget />
              {!session?.user ? (
                <>
                  <Link href={getUrlWithRef("/login")}>
                    <button
                      className="px-3 py-2 font-medium rounded-lg transition-all duration-200 hover:shadow-lg text-sm"
                      style={{
                        color: "var(--accent)",
                        border: "1px solid var(--accent)",
                        backgroundColor: "transparent",
                      }}
                    >
                      Log In
                    </button>
                  </Link>
         
                  <Link href={getUrlWithRef("/signup")}>
                    <button className="button px-3 py-2 font-medium rounded-lg transition-all duration-200 hover:shadow-lg text-sm">
                      Join now
                    </button>
                  </Link>
   
                </>
              ) : (
                <div className="flex items-center gap-4">
                  <Logout />
                  <Link href={getUrlWithRef("/user/profile")} className="hidden lg:block">
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
              className="lg:hidden p-2 rounded-lg transition-colors duration-200"
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
            className="lg:hidden absolute top-16 left-0 right-0 shadow-lg border-t"
            style={{
              backgroundColor: "var(--background)",
              borderColor: "var(--border)",
            }}
          >
            <div className="px-4 py-3 space-y-3">
              <Link
                href={getUrlWithRef("/")}
                className="block py-2 px-4 rounded-lg font-medium transition-colors duration-200"
                style={{
                  backgroundColor: isActive("/") ? "var(--primary)" : "var(--card)",
                  color: isActive("/") ? "var(--background)" : "var(--text)",
                }}
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
            
              <Link 
                href={getUrlWithRef("/about")} 
                className="block py-2 px-4 rounded-lg font-medium transition-colors duration-200"
                style={{ 
                  backgroundColor: isActive("/about") ? "var(--primary)" : "var(--card)",
                  color: isActive("/about") ? "var(--background)" : "var(--text)"
                }}
                onClick={() => setIsMenuOpen(false)}
              >
                Mission
              </Link>
              <Link 
                href={getUrlWithRef("/products")} 
                className="block py-2 px-4 rounded-lg font-medium transition-colors duration-200"
                style={{ 
                  backgroundColor: isActive("/products") ? "var(--primary)" : "var(--card)",
                  color: isActive("/products") ? "var(--background)" : "var(--text)"
                }}
                onClick={() => setIsMenuOpen(false)}
              >
                Resources
              </Link>
              <Link 
                href={getUrlWithRef("/partner-program")} 
                className="block py-2 px-4 rounded-lg font-medium transition-colors duration-200"
                style={{ 
                  backgroundColor: isActive("/partner-program") ? "var(--primary)" : "var(--card)",
                  color: isActive("/partner-program") ? "var(--background)" : "var(--text)"
                }}
                onClick={() => setIsMenuOpen(false)}
              >
                Partner Program
              </Link>
              <Link
                href={getUrlWithRef("/blogs")}
                className="block py-2 px-4 rounded-lg font-medium transition-colors duration-200"
                style={{
                  backgroundColor: isActive("/blogs") ? "var(--primary)" : "var(--card)",
                  color: isActive("/blogs") ? "var(--background)" : "var(--text)",
                }}
                onClick={() => setIsMenuOpen(false)}
              >
                Training
              </Link>
              <Link 
                href={getUrlWithRef("/contact")} 
                className="block py-2 px-4 rounded-lg font-medium transition-colors duration-200"
                style={{ 
                  backgroundColor: isActive("/contact") ? "var(--primary)" : "var(--card)",
                  color: isActive("/contact") ? "var(--background)" : "var(--text)"
                }}
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
              {session?.user && (
                <Link
                  href={getUrlWithRef("/dashboard")}
                  className="block py-2 px-4 rounded-lg font-medium transition-colors duration-200"
                  style={{
                    backgroundColor: isActive("/dashboard") ? "var(--primary)" : "var(--card)",
                    color: isActive("/dashboard") ? "var(--background)" : "var(--text)",
                  }}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
              )}

              {/* Mobile Translation Widget */}
              <div className="py-2 px-4">
                <TranslateWidget />
              </div>

              {/* Mobile Auth Buttons */}
              <div
                className="pt-3 border-t"
                style={{ borderColor: "var(--border)" }}
              >
                {!session?.user ? (
                  <div className="flex flex-col gap-2">
                    <Link href={getUrlWithRef("/login")} onClick={() => setIsMenuOpen(false)}>
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
                    <Link href={getUrlWithRef("/signup")} onClick={() => setIsMenuOpen(false)}>
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
                      <Link href={getUrlWithRef("/user/profile")}>
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
