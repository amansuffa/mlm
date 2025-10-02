"use client";
import React from "react";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaYoutube } from "react-icons/fa";

const socialPlatforms = [
  { name: "Facebook", icon: <FaFacebookF />, url: "https://facebook.com" },
  { name: "Twitter", icon: <FaTwitter />, url: "https://twitter.com" },
  { name: "Instagram", icon: <FaInstagram />, url: "https://instagram.com" },
  { name: "LinkedIn", icon: <FaLinkedinIn />, url: "https://linkedin.com" },
  { name: "YouTube", icon: <FaYoutube />, url: "https://youtube.com" },
];

export default function SocialIcons({ className = "flex gap-3" }) {
  return (
    <div className={className}>
      {socialPlatforms.map((platform) => (
        <a
          key={platform.name}
          href={platform.url}
          target="_blank"
          rel="noopener noreferrer"
          className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition text-gray-700"
          title={platform.name}
        >
          {platform.icon}
        </a>
      ))}
    </div>
  );
}
