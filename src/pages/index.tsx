
"use client";

import Link from "next/link";
import { ArrowRightIcon } from "@heroicons/react/24/outline";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--text-primary)] flex flex-col items-center justify-center px-4">
      <header className="text-center max-w-3xl mx-auto mb-12">
        <h1 className="text-4xl sm:text-5xl font-bold text-[var(--primary)] mb-4">
          Turn Your Ideas into Social Media Magic with forma
        </h1>
        <p className="text-lg sm:text-xl text-[var(--text-secondary)] mb-8">
          Transform long texts into polished Twitter threads, LinkedIn posts, and more in seconds. Create, share, and shine.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/signup" className="btn px-6 py-3 text-lg transition-all duration-300 hover:scale-105">
            Get Started
          </Link>
          <Link href="#features" className="btn-secondary px-6 py-3 text-lg transition-all duration-300 hover:scale-105">
            Learn More
          </Link>
        </div>
      </header>

      <section id="features" className="container py-12">
        <h2 className="text-3xl font-semibold text-center text-[var(--primary)] mb-8">Why forma?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card p-6 text-center animate-fade-in">
            <h3 className="text-xl font-medium text-[var(--text-primary)] mb-2">Effortless Formatting</h3>
            <p className="text-[var(--text-secondary)]">Paste your text and let forma craft perfect posts for any platform.</p>
          </div>
          <div className="card p-6 text-center animate-fade-in">
            <h3 className="text-xl font-medium text-[var(--text-primary)] mb-2">Real-Time Previews</h3>
            <p className="text-[var(--text-secondary)]">See your posts come to life instantly, tailored to Twitter, LinkedIn, and more.</p>
          </div>
          <div className="card p-6 text-center animate-fade-in">
            <h3 className="text-xl font-medium text-[var(--text-primary)] mb-2">Community & Templates</h3>
            <p className="text-[var(--text-secondary)]">Join creators, share posts, and use trending templates to stay ahead.</p>
          </div>
        </div>
      </section>

      <section className="container py-12 text-center">
        <h2 className="text-3xl font-semibold text-[var(--primary)] mb-4">Ready to Create?</h2>
        <p className="text-lg text-[var(--text-secondary)] mb-6">Join thousands of creators turning ideas into impact.</p>
        <Link href="/signup" className="btn px-6 py-3 text-lg inline-flex items-center gap-2 transition-all duration-300 hover:scale-105">
          Start Now <ArrowRightIcon className="h-5 w-5" />
        </Link>
      </section>
    </div>
  );
}
