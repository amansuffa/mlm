"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { motion } from "framer-motion";

// 🔠 Typewriter animation helper
const TypewriterText = ({ text, delayOffset = 0 }) => (
  <>
    {text.split("").map((char, i) => (
      <motion.span
        key={i}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: i * 0.08 + delayOffset }}
      >
        {char}
      </motion.span>
    ))}
  </>
);

export default function Signup() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [referralId, setReferralId] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const refFromUrl = searchParams.get("ref");
    if (refFromUrl) setReferralId(refFromUrl);
  }, [searchParams]);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const formData = new FormData(e.currentTarget);
      const name = formData.get("name");
      const username = formData.get("username");
      const email = formData.get("email");
      const password = formData.get("password");

      const res = await axios.post("/api/signup", {
        name,
        email,
        password,
        username,
        referredBy: referralId || null,
      });

      if (res.status === 201) {
        router.push("/check-email");
      }
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 via-purple-200 to-purple-200 px-6 py-10">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="bg-white/70 backdrop-blur-xl shadow-2xl rounded-3xl p-10 w-full max-w-md border border-white/40"
      >
        <motion.h1 className="text-3xl font-bold text-center bg-gradient-to-r from-violet-500 via-purple-700 to-fuchsia-900 bg-clip-text text-transparent mb-3">
          <TypewriterText text="Create Account ✨" />
        </motion.h1>

        <p className="text-sm text-center text-gray-700">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-fuchsia-900 hover:underline">
            Log in
          </Link>
        </p>

        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 text-center text-sm text-red-500"
          >
            {error}
          </motion.p>
        )}

        <motion.form
          onSubmit={handleSubmit}
          className="space-y-5 py-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <input
            name="name"
            type="text"
            placeholder="Name"
            className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-purple-400 focus:outline-none"
            required
          />
          <input
            name="username"
            type="text"
            placeholder="Username"
            className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-purple-400 focus:outline-none"
            required
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-purple-400 focus:outline-none"
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-purple-400 focus:outline-none"
            required
          />

          {referralId ? (
            <input
              type="text"
              value={referralId}
              readOnly
              className="w-full px-4 py-2 border rounded-xl bg-gray-100 text-gray-600"
            />
          ) : (
            <input
              type="text"
              placeholder="Referral ID (optional)"
              onChange={(e) => setReferralId(e.target.value)}
              className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-purple-400 focus:outline-none"
            />
          )}

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={loading}
            className={`w-full py-3 font-semibold rounded-xl shadow-lg text-white transition ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-purple-600 to-fuchsia-800 hover:opacity-90"
            }`}
          >
            {loading ? "Creating..." : "Create Account"}
          </motion.button>
        </motion.form>
      </motion.div>
    </div>
  );
}
