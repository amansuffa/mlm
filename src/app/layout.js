import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Toaster } from "react-hot-toast";

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
  title: "PASH.CLUB | AN INVITATION TO AN ELEVATED LIFESTYLE",
  description:
    "Upgrade your digital skills with PASH CLUB — a modern training platform offering structured learning, implementation guidance, AI-assisted tools, and a global professional development community.",
     keywords: [
    "digital skills training",
    "professional development",
    "online business education",
    "management development",
    "digital marketing training",
    "productivity systems",
    "AI learning tools"
  ],
};

export default async function RootLayout({ children }) {
  // await connectDB();

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={true}
          disableTransitionOnChange={false}
        >
          <Providers>
            {children}
            <Toaster position="top-right" />
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
