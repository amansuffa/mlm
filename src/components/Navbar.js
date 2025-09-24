"use client";
import Link from "next/link";
import { useSession } from "next-auth/react";
import Logout from "./Logout";
import Image from "next/image";

import logo from "../assets/logo.png";


export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="bg-white shadow-md">
      <div className="w-full h-[68px] px-4 py-3 flex justify-between items-center">
        {/* Left Side - Logo & Links */}
        <div className="flex items-center gap-6">
             <div className="flex justify-center overflow-hidden">
        <Image
          className="object-cover mb-1"
          src={logo}
          alt="Logo"
          width={180}  
          height={180}
        />
      </div>
          <Link href="/" className="text-gray-700 hover:text-purple-600">
            Home
          </Link>
          <Link href="/blogs" className="text-gray-700 hover:text-purple-600">
            Blogs
          </Link>
          <Link href="/about" className="text-gray-700 hover:text-purple-600">
            About
          </Link>
          {session?.user && (
            <Link href="/dashboard" className="text-gray-700 hover:text-purple-600">
              Dashboard
            </Link>
          )}
        </div>

        {/* Right Side - Login/Signup or Profile */}
        <div className="flex items-center gap-3">
          {!session?.user ? (
            <>
              <Link href="/login">
                <button className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700">
                  Login
                </button>
              </Link>
              <Link href="/signup">
                <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">
                  Signup
                </button>
              </Link>
            </>
          ) : (
            <Logout/>
          )}
        </div>
      </div>
    </nav>
  );
}
