"use client";
import React from "react";
import { doSocialLogin } from "@/app/actions";
import { FaGoogle } from "react-icons/fa";
import { motion } from "framer-motion";

const SocialLogin = () => {


  return (
    <div>
      {/* Divider */}
      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-gray-300"></span>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-white/70 backdrop-blur-md px-3 text-gray-600">
            or continue with
          </span>
        </div>
      </div>

      <div className="w-full flex flex-col gap-4">
        <form action={doSocialLogin}>
        {/* Google Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
         type="submit"
            name="action"
            value="google"
          className="w-full flex items-center justify-center gap-3 py-3 rounded-xl border border-gray-300 bg-white/80 backdrop-blur-md shadow-sm hover:bg-gradient-to-r hover:from-blue-600 hover:to-pink-600 hover:text-white transition font-medium text-gray-700"
        >
          <FaGoogle className="text-lg" />
          Continue with Google
        </motion.button>
        </form>
      </div>
    </div>
  );
};

export default SocialLogin;
