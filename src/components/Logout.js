"use client";
import { signOut } from 'next-auth/react';
import React from 'react';

const Logout = () => {
  return (
    <button
      onClick={() => signOut({ redirect: false })}
      className="button px-4 py-2 rounded-md text-white font-medium shadow hover:shadow-[inset_0_4px_6px_rgba(0,0,0,0.2)] transform hover:scale-102 transition"
    >
      Logout
    </button>
  )
}

export default Logout
