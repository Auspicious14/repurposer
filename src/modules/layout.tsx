"use client";
import Link from "next/link";
import { Header, Footer } from "@/components";
import { Poppins, Open_Sans, Montserrat } from "next/font/google";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { request } from "http";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-heading",
});
const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-body",
});
const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["700"],
  variable: "--font-cta",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  // const isLoggedIn = request.headers.get["x-status-status"] === "true";
  const isLoggedIn = true;
  return (
    <div
      className={`${poppins.variable} ${openSans.variable} ${montserrat.variable}`}
    >
      <Header isLoggedIn={isLoggedIn} />
      {children}

      <Footer />
    </div>
  );
}
