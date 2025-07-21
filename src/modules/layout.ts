"use client";
import Link from "next/link";
import { Header, Footer } from "@/components"
import { Poppins, Open_Sans, Montserrat } from "next/font/google";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

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

  return (
    <div className={`${poppins.variable} ${openSans.variable} ${montserrat.variable}`} >
      
      <Header />

        /* <AnimatePresence>
          {isOpen && (
            <>
              <motion.div
                className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsOpen(false)}
              />
              <motion.nav
                className="fixed top-0 right-0 h-full w-64 bg-white z-50 shadow-lg px-6 py-8 space-y-6"
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "tween", duration: 0.3 }}
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-blue-400">Menu</h2>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-orange-500"
                  >
                    <XMarkIcon
                      className="w-6 h-6"
                      onClick={() => setIsOpen(!isOpen)}
                    />
                  </button>
                </div>

                <Link
                  href="/"
                  className="block text-gray-700 hover:text-orange-500"
                >
                  Home
                </Link>
                <Link
                  href="/features"
                  className="block text-gray-700 hover:text-orange-500"
                >
                  Features
                </Link>
                <Link
                  href="/gallery"
                  className="block text-gray-700 hover:text-orange-500"
                >
                  Gallery
                </Link>
                <Link
                  href="/signin"
                  className="block text-gray-700 hover:text-orange-500"
                >
                  Login
                </Link>
              </motion.nav>
            </>
          )}
        </AnimatePresence> */
      
      {children}

      <Footer />
    </div>
  );
}
