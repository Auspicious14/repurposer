"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Header, Footer } from "@/components";

export const LandingPage = () => {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) router.push("/dashboard");
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--text-primary)]">
      {/* HERO SECTION */}
      <section className="container flex flex-col items-center text-center py-20 md:py-28">
        <h1 className="text-5xl md:text-6xl font-extrabold leading-tight text-[var(--primary)] mb-6 animate-fade-in">
          Format Once. Post Everywhere.
        </h1>
        <p className="text-xl md:text-2xl text-[var(--text-secondary)] max-w-2xl mb-8">
          Forma helps creators instantly repurpose long-form content into
          scroll-stopping Twitter threads, LinkedIn posts, and more.
        </p>
        <div className="flex gap-4">
          <Link
            href="/signup"
            className="btn px-8 py-3 text-lg hover:scale-105 transition-transform duration-300"
          >
            Get Started Free
          </Link>
          <Link
            href="#features"
            className="btn-secondary px-8 py-3 text-lg hover:scale-105 transition-transform duration-300"
          >
            Explore Features
          </Link>
        </div>
      </section>

      {/* PROBLEM SECTION */}
      <section className="bg-[var(--background-muted)] py-16">
        <div className="container max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">
            Tired of Copy-Pasting Everywhere?
          </h2>
          <p className="text-lg text-[var(--text-secondary)]">
            {
              "Posting on multiple platforms is time-consuming. One format doesn't  fit all. And rewriting the same idea five times? Painful."
            }
          </p>
        </div>
      </section>

      {/* SOLUTION / MOCKUP SECTION */}
      <section className="container py-16 flex flex-col md:flex-row items-center gap-10">
        <div className="flex-1">
          <h2 className="text-4xl font-bold mb-4">Meet Forma 👋</h2>
          <p className="text-lg text-[var(--text-secondary)] mb-6">
            Forma turns your blog posts, drafts, or thoughts into
            platform-perfect posts using smart formatting and templates. One
            input, multi-output.
          </p>
          <ul className="list-disc pl-6 text-[var(--text-secondary)]">
            <li>Repurpose content instantly</li>
            <li>Preview before publishing</li>
            <li>Format for Twitter, LinkedIn, and more</li>
          </ul>
        </div>
        <div className="flex-1">
          {/* Replace with your real mockup */}
          <div className="w-full aspect-video bg-gray-200 rounded-xl shadow-md animate-fade-in">
            <p className="text-center py-20 text-xl text-gray-500">
              [Insert UI Preview / Screenshot]
            </p>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section id="features" className="container py-20">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Why Creators Love Forma
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "Instant Formatting",
              desc: "Paste your long-form idea. Forma turns it into platform-ready formats in seconds.",
            },
            {
              title: "Live Previews",
              desc: "See exactly what your tweet or post will look like before you hit publish.",
            },
            {
              title: "Multi-Platform Outputs",
              desc: "Get formats tailored for Twitter, LinkedIn, Instagram Threads, and more.",
            },
          ].map((f, i) => (
            <div
              key={i}
              className="card p-6 rounded-xl bg-white dark:bg-[var(--card-bg)] shadow-lg animate-fade-in"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <h3 className="text-xl font-semibold text-[var(--primary)] mb-3">
                {f.title}
              </h3>
              <p className="text-[var(--text-secondary)]">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIAL SECTION */}
      <section className="bg-[var(--background-muted)] py-20 text-center">
        <div className="container max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">Trusted by Creators</h2>
          <p className="text-[var(--text-secondary)] mb-8">
            “Forma has completely changed how I write content. I save hours
            weekly, and my posts now look pro on every platform.” —{" "}
            <strong>@NotionNerd</strong>
          </p>
          <p className="text-[var(--text-secondary)] mb-8">
            “I just paste my blog post in and boom — 3 tweets, a thread, and a
            LinkedIn post. Worth every click.” — <strong>@ProductGuy</strong>
          </p>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="bg-[var(--primary)] text-white py-20 text-center">
        <div className="container">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Create Like a Pro?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join 500+ creators who’ve made content creation 5x faster using
            Forma.
          </p>
          <Link
            href="/signup"
            className="btn-secondary bg-white text-[var(--primary)] px-8 py-3 text-lg hover:scale-105 transition-transform duration-300"
          >
            Start Free Now
          </Link>
        </div>
      </section>
    </div>
  );
};
