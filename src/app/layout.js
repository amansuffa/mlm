
import { Geist, Geist_Mono } from "next/font/google";
import { SessionProvider } from 'next-auth/react';

import "./globals.css";
import { connectDB } from "@/lib/mongodb";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "MLM App",
  description: "A simple MLM app built with Next.js and MongoDB",
};

export default async function RootLayout({ children }) {
    await connectDB();
    

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionProvider>
        {children}
        </SessionProvider>
      </body>
    </html>
  );
}
