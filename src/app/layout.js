import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";
import Providers from "./Provider";
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
  // await connectDB();

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white dark:bg-black transition-colors duration-300`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
