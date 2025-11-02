"use client";
import { useState } from "react";
import Link from "next/link";
import { doLogin } from "@/app/actions";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { getSession } from "next-auth/react";

export default function Login() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const formData = new FormData(e.currentTarget);
      const res = await doLogin(formData);

      if (res?.error) {
        setError(res.error);
        setLoading(false);
      } else {
        const session = await getSession();
        console.log("Session after login:", session?.user);

         if (session?.user) {
          router.push("/dashboard");
        }
      }
    } catch (err) {
      setError("Check Credentials");
      setLoading(false);
    }
  }

  const typewriterText = (text, delayOffset = 0) =>
    text.split("").map((char, i) => (
      <motion.span
        key={i}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: i * 0.07 + delayOffset }}
      >
        {char}
      </motion.span>
    ));

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 via-purple-200 to-purple-200 px-6 py-10">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="bg-white/80 backdrop-blur-xl shadow-2xl rounded-3xl flex flex-col md:flex-row overflow-hidden w-full max-w-4xl min-h-[550px]"
      >
        {/* Left side */}
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="md:w-1/2 flex flex-col items-center justify-center text-white p-8 bg-cover bg-center"
          style={{
            backgroundImage: "url('/employee-working-marketing-setting.jpg')",
          }}
        ></motion.div>

        {/* Right side */}
        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="md:w-1/2 flex flex-col justify-center p-10"
        >
          <div className="w-full flex justify-center p-4 rounded-xl">
            <h1 className="text-4xl font-extrabold mb-2 text-center text-purple-700">
              {typewriterText("Welcome Back 👋")}
            </h1>
          </div>

          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-3xl font-bold text-center text-purple-700 mb-4"
          >
            {typewriterText("Login", 0.5)}
          </motion.h2>

          <p className="text-sm text-center text-gray-700 mb-6">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="font-semibold text-fuchsia-800 hover:underline"
            >
              Sign up
            </Link>
          </p>

          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-4 text-center text-sm text-red-500"
            >
              {error}
            </motion.p>
          )}

          <motion.form
            onSubmit={handleSubmit}
            className="space-y-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
          >
            <div>
              <label className="block text-sm font-medium text-gray-800">
                Email
              </label>
              <input
                name="email"
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-2 mt-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-400 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-800">
                Password
              </label>
              <input
                name="password"
                type="password"
                placeholder="Enter your password"
                className="w-full px-4 py-2 mt-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-400 focus:outline-none"
                required
              />
            </div>

            <motion.button
              whileHover={!loading ? { scale: 1.05 } : {}}
              whileTap={!loading ? { scale: 0.95 } : {}}
              type="submit"
              disabled={loading}
              className={`w-full py-3 flex items-center justify-center bg-gradient-to-r from-purple-600 to-fuchsia-800 text-white font-semibold rounded-xl shadow-lg transition ${
                loading ? "opacity-70 cursor-not-allowed" : "hover:opacity-90"
              }`}
            >
              {loading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  className="h-5 w-5 border-2 border-white border-t-transparent rounded-full"
                />
              ) : (
                "Login"
              )}
            </motion.button>
          </motion.form>
        </motion.div>
      </motion.div>
    </div>
  );
}
