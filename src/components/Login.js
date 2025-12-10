"use client";
import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import toast, { Toaster } from "react-hot-toast";

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { update } = useSession();
  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    
    const result = await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirect: false,
    });

    if (result?.error) {
      toast.error("Invalid credentials");
      setLoading(false);
    } else if (result?.ok) {
      toast.success("Login successful!");
      setLoading(false);
      router.push("/dashboard");
    }
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  const imageVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  const formVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  return (
    <div className="min-h-screen bg-[var(--background)] py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="header rounded-2xl shadow-xl overflow-hidden">
            <div className="px-8 py-8">
              <div className="flex flex-col items-center text-center">
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                  className="text-3xl lg:text-4xl font-bold text-white mb-2"
                >
                  Welcome Back to PASH.CLUB
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                  className="text-blue-100 text-lg"
                >
                  Sign in to access your account and continue your journey
                </motion.p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Login Form Card */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="card rounded-2xl shadow-xl overflow-hidden"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Left Side - Image */}
            <motion.div
              variants={imageVariants}
              className="bg-cover bg-center min-h-[400px] lg:min-h-[500px]"
              style={{
                backgroundImage:
                  "url('/employee-working-marketing-setting.jpg')",
              }}
            />

            {/* Right Side - Login Form */}
            <motion.div variants={formVariants} className="p-8 lg:p-12">
              <div className="max-w-md mx-auto">
                <motion.div variants={itemVariants}>
                  <h2 className="text-2xl font-bold mb-2">
                    Login to Your Account
                  </h2>
                  <p className="text-[var(--text)] mb-8">
                    Don&apos;t have an account?{" "}
                    <Link
                      href="/signup"
                      className="text-[var(--primary)] font-semibold hover:underline transition-all duration-300"
                    >
                      Sign up here
                    </Link>
                  </p>
                </motion.div>

                <motion.form
                  onSubmit={handleSubmit}
                  className="space-y-6"
                  variants={containerVariants}
                >
                  <motion.div variants={itemVariants} className="space-y-2">
                    <label className="block text-sm font-medium">
                      Email Address *
                    </label>
                    <motion.input
                      whileFocus={{ scale: 1.02 }}
                      name="email"
                      type="email"
                      required
                      placeholder="Enter your email"
                      onFocus={(e) =>
                        (e.target.style.borderColor = "var(--primary)")
                      }
                      onBlur={(e) =>
                        (e.target.style.borderColor = "var(--border)")
                      }
                      className="card-secondary w-full border-2 rounded-xl px-4 py-3 focus:outline-none focus:ring-1 transition-all duration-300"
                      style={{
                        "--tw-ring-color": "var(--primary)",
                      }}
                    />
                  </motion.div>

                  <motion.div variants={itemVariants} className="space-y-2">
                    <label className="block text-sm font-medium">
                      Password *
                    </label>
                    <div className="relative">
                      <motion.input
                        whileFocus={{ scale: 1.02 }}
                        name="password"
                        type={showPassword ? "text" : "password"}
                        required
                        placeholder="Enter your password"
                        onFocus={(e) =>
                          (e.target.style.borderColor = "var(--primary)")
                        }
                        onBlur={(e) =>
                          (e.target.style.borderColor = "var(--border)")
                        }
                        className="card-secondary w-full border-2 rounded-xl px-4 py-3 pr-12 focus:outline-none focus:ring-1 transition-all duration-300"
                        style={{
                          "--tw-ring-color": "var(--primary)",
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showPassword ? (
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                          </svg>
                        ) : (
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                            />
                          </svg>
                        )}
                      </button>
                    </div>
                  </motion.div>

                  <motion.div
                    variants={itemVariants}
                    className="flex items-center justify-between"
                  >
                    <Link
                      href="/forgot-password"
                      className="text-sm text-[var(--primary)] hover:underline transition-all duration-300"
                    >
                      Forgot password?
                    </Link>
                  </motion.div>

                  <motion.button
                    variants={itemVariants}
                    whileHover={
                      !loading
                        ? {
                            scale: 1.02,
                            boxShadow:
                              "0 10px 25px -5px rgba(130, 0, 219, 0.3)",
                          }
                        : {}
                    }
                    whileTap={!loading ? { scale: 0.98 } : {}}
                    type="submit"
                    disabled={loading}
                    className="button-secondary w-full py-3 bg-gradient-to-r text-white rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {loading ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          repeat: Infinity,
                          duration: 1,
                          ease: "linear",
                        }}
                        className="h-5 w-5 border-2 border-white border-t-transparent rounded-full"
                      />
                    ) : (
                      "Sign In"
                    )}
                  </motion.button>
                </motion.form>

                <motion.div
                  variants={itemVariants}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="mt-8 p-4 bg-[var(--cardSecondary)] rounded-xl border border-gray-200"
                >
                  <p className="text-xs text-[var(--text)] text-center">
                    Your information is securely encrypted and protected
                  </p>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
