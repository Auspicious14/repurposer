"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Header, Footer } from "@/components";

export const LandingPage = () => {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      router.push("/dashboard");
    }
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--text-primary)]">
      <Header />
      <section className="container flex flex-col items-center justify-center text-center py-16 md:py-24">
        <h1 className="text-4xl md:text-5xl font-bold text-[var(--primary)] mb-6 animate-fade-in">
          Turn Your Ideas into Perfect Social Posts
        </h1>
        <p className="text-lg md:text-xl text-[var(--text-secondary)] max-w-3xl mb-8">
          Forma helps creators craft engaging Twitter threads, LinkedIn posts,
          and more in seconds. Simplify your workflow and shine online.
        </p>
        <div className="flex gap-4">
          <Link
            href="/signup"
            className="btn px-8 py-3 text-lg hover:scale-105 transition-all duration-300"
          >
            Get Started
          </Link>
          <Link
            href="#features"
            className="btn-secondary px-8 py-3 text-lg hover:scale-105 transition-all duration-300"
          >
            Learn More
          </Link>
        </div>
      </section>
      <section id="features" className="container py-16">
        <h2 className="text-3xl font-bold text-center text-[var(--text-primary)] mb-12">
          Why Choose forma?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="card p-6 animate-fade-in">
            <h3 className="text-xl font-semibold text-[var(--primary)] mb-4">
              Fast Formatting
            </h3>
            <p className="text-[var(--text-secondary)]">
              Turn long texts into platform-ready posts with one click.
            </p>
          </div>
          <div
            className="card p-6 animate-fade-in"
            style={{ animationDelay: "0.1s" }}
          >
            <h3 className="text-xl font-semibold text-[var(--primary)] mb-4">
              Live Previews
            </h3>
            <p className="text-[var(--text-secondary)]">
              See exactly how your post will look before publishing.
            </p>
          </div>
          <div
            className="card p-6 animate-fade-in"
            style={{ animationDelay: "0.2s" }}
          >
            <h3 className="text-xl font-semibold text-[var(--primary)] mb-4">
              Multi-Platform
            </h3>
            <p className="text-[var(--text-secondary)]">
              Craft content for Twitter, LinkedIn, and more, effortlessly.
            </p>
          </div>
        </div>
      </section>
      <section className="bg-[var(--primary)] text-white py-16 text-center">
        <div className="container">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Create with Forma?
          </h2>
          <p className="text-lg mb-8 max-w-xl mx-auto">
            Join thousands of creators simplifying their social media game.
          </p>
          <Link
            href="/signup"
            className="btn-secondary px-8 py-3 text-lg hover:scale-105 transition-all duration-300"
          >
            Sign Up Now
          </Link>
        </div>
      </section>
      <Footer />
    </div>
  );
};
