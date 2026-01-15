'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#030014]">
      {/* Navigation */}
      <nav className="fixed left-0 right-0 top-0 z-50 border-b border-zinc-800/50 bg-[#030014]/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-purple-600">
              <span className="text-sm font-bold text-white">T</span>
            </div>
            <span className="text-xl font-bold text-white">TechLearn</span>
          </a>

          {/* Desktop Nav Links */}
          <div className="hidden items-center gap-8 md:flex">
            <a href="#reviews" className="text-sm text-zinc-400 transition-colors hover:text-white">
              Reviews
            </a>
            <a href="#contact" className="text-sm text-zinc-400 transition-colors hover:text-white">
              Contact
            </a>
          </div>

          {/* Desktop Sign In Button */}
          <Link
            href="/auth"
            className="hidden h-10 items-center justify-center rounded-full border border-zinc-700 bg-zinc-900/50 px-5 text-sm font-medium text-zinc-300 backdrop-blur-sm transition-all hover:border-cyan-500/50 hover:bg-zinc-800/50 hover:text-white md:inline-flex"
          >
            Sign In
          </Link>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-white md:hidden"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="border-t border-zinc-800/50 bg-[#030014]/95 backdrop-blur-md md:hidden">
            <div className="flex flex-col px-6 py-4">
              <a
                href="#"
                onClick={() => setMobileMenuOpen(false)}
                className="py-3 text-sm text-zinc-400 transition-colors hover:text-white"
              >
                Resources
              </a>
              <a
                href="#contact"
                onClick={() => setMobileMenuOpen(false)}
                className="py-3 text-sm text-zinc-400 transition-colors hover:text-white"
              >
                Contact
              </a>
              <div className="mt-2 border-t border-zinc-800 pt-4">
                <Link
                  href="/auth"
                  onClick={() => setMobileMenuOpen(false)}
                  className="inline-flex h-10 w-full items-center justify-center rounded-full border border-zinc-700 bg-zinc-900/50 px-5 text-sm font-medium text-zinc-300 transition-all hover:border-cyan-500/50 hover:bg-zinc-800/50 hover:text-white"
                >
                  Sign In
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Animated grid background */}
      <div className="tech-grid absolute inset-0" />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#030014]/50 to-[#030014]" />

      {/* Glowing orbs */}
      <div
        className="glow-orb"
        style={{
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.4) 0%, transparent 70%)',
          top: '-200px',
          right: '-100px',
        }}
      />
      <div
        className="glow-orb"
        style={{
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(0, 240, 255, 0.3) 0%, transparent 70%)',
          bottom: '-150px',
          left: '-100px',
          animationDelay: '2s',
        }}
      />
      <div
        className="glow-orb"
        style={{
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(236, 72, 153, 0.3) 0%, transparent 70%)',
          top: '40%',
          left: '60%',
          animationDelay: '1s',
        }}
      />

      {/* Floating particles */}
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="particle"
          style={{
            left: `${15 + i * 15}%`,
            bottom: '10%',
            animationDelay: `${i * 1.2}s`,
            animationDuration: `${6 + i}s`,
          }}
        />
      ))}

      {/* Main content */}
      <main className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 text-center">
        {/* Badge */}
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-2 text-sm text-cyan-400">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-500"></span>
          </span>
          Now accepting new students
        </div>

        {/* Headline */}
        <h1 className="max-w-4xl text-5xl font-bold leading-tight tracking-tight text-white sm:text-6xl md:text-7xl">
          Master the art of
          <span className="gradient-text block">building technology</span>
        </h1>

        {/* Subheadline */}
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-zinc-400 sm:text-xl">
          Learn to build real-world applications with hands-on courses. From web development
          to AI, we&apos;ll guide you from beginner to professional developer.
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <Link
            href="/auth"
            className="group relative inline-flex h-14 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 px-8 text-base font-semibold text-white transition-all hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/25"
          >
            Start Learning Free
            <svg
              className="h-5 w-5 transition-transform group-hover:translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
          <button className="inline-flex h-14 items-center justify-center gap-2 rounded-full border border-zinc-700 bg-zinc-900/50 px-8 text-base font-semibold text-zinc-300 backdrop-blur-sm transition-all hover:border-zinc-600 hover:bg-zinc-800/50 hover:text-white">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Watch Demo
          </button>
        </div>

        {/* Stats */}
        <div className="mt-16 flex flex-wrap items-center justify-center gap-8 border-t border-zinc-800 pt-10 sm:gap-16">
          <div className="text-center">
            <div className="text-3xl font-bold text-white">10K+</div>
            <div className="mt-1 text-sm text-zinc-500">Students</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white">50+</div>
            <div className="mt-1 text-sm text-zinc-500">Courses</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white">95%</div>
            <div className="mt-1 text-sm text-zinc-500">Completion Rate</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white">4.9</div>
            <div className="mt-1 text-sm text-zinc-500">Avg Rating</div>
          </div>
        </div>
      </main>

      {/* Testimonials Section */}
      <section id="reviews" className="relative z-10 scroll-mt-20 px-6 pb-24 pt-16">
        <div className="mx-auto max-w-6xl">
          {/* Section Header */}
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              Loved by <span className="gradient-text">developers</span> worldwide
            </h2>
            <p className="mt-4 text-zinc-400">
              Join thousands of students who transformed their careers with TechLearn
            </p>
          </div>

          {/* Testimonials Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Testimonial 1 */}
            <div className="group rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 backdrop-blur-sm transition-all hover:border-cyan-500/30 hover:bg-zinc-900/80">
              <div className="mb-4 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 text-lg font-bold text-white">
                  SK
                </div>
                <div>
                  <div className="font-semibold text-white">Sarah Kim</div>
                  <div className="text-sm text-zinc-500">Frontend Developer at Google</div>
                </div>
              </div>
              <p className="text-zinc-400">
                &quot;TechLearn&apos;s project-based approach helped me land my dream job. The React course was exactly what I needed to level up my skills.&quot;
              </p>
              <div className="mt-4 flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="h-5 w-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="group rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 backdrop-blur-sm transition-all hover:border-purple-500/30 hover:bg-zinc-900/80">
              <div className="mb-4 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-600 text-lg font-bold text-white">
                  MR
                </div>
                <div>
                  <div className="font-semibold text-white">Marcus Rodriguez</div>
                  <div className="text-sm text-zinc-500">Full Stack Engineer at Stripe</div>
                </div>
              </div>
              <p className="text-zinc-400">
                &quot;I went from knowing basic HTML to building full-stack apps in 6 months. The AI assistant feature is like having a mentor available 24/7.&quot;
              </p>
              <div className="mt-4 flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="h-5 w-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="group rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 backdrop-blur-sm transition-all hover:border-cyan-500/30 hover:bg-zinc-900/80">
              <div className="mb-4 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-teal-600 text-lg font-bold text-white">
                  EJ
                </div>
                <div>
                  <div className="font-semibold text-white">Emily Johnson</div>
                  <div className="text-sm text-zinc-500">ML Engineer at OpenAI</div>
                </div>
              </div>
              <p className="text-zinc-400">
                &quot;The machine learning track is outstanding. Real datasets, practical projects, and instructors who actually work in the field.&quot;
              </p>
              <div className="mt-4 flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="h-5 w-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>

            {/* Testimonial 4 */}
            <div className="group rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 backdrop-blur-sm transition-all hover:border-purple-500/30 hover:bg-zinc-900/80">
              <div className="mb-4 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-red-600 text-lg font-bold text-white">
                  AP
                </div>
                <div>
                  <div className="font-semibold text-white">Alex Patel</div>
                  <div className="text-sm text-zinc-500">Software Engineer at Netflix</div>
                </div>
              </div>
              <p className="text-zinc-400">
                &quot;Best investment I&apos;ve made in my career. The community and peer code reviews pushed me to write better code every day.&quot;
              </p>
              <div className="mt-4 flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="h-5 w-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>

            {/* Testimonial 5 */}
            <div className="group rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 backdrop-blur-sm transition-all hover:border-cyan-500/30 hover:bg-zinc-900/80">
              <div className="mb-4 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-emerald-600 text-lg font-bold text-white">
                  JL
                </div>
                <div>
                  <div className="font-semibold text-white">Jordan Lee</div>
                  <div className="text-sm text-zinc-500">DevOps Lead at Shopify</div>
                </div>
              </div>
              <p className="text-zinc-400">
                &quot;The DevOps and cloud infrastructure courses are incredibly well-structured. Went from zero AWS knowledge to certified in 3 months.&quot;
              </p>
              <div className="mt-4 flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="h-5 w-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>

            {/* Testimonial 6 */}
            <div className="group rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 backdrop-blur-sm transition-all hover:border-purple-500/30 hover:bg-zinc-900/80">
              <div className="mb-4 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-pink-500 to-rose-600 text-lg font-bold text-white">
                  RW
                </div>
                <div>
                  <div className="font-semibold text-white">Rachel Wang</div>
                  <div className="text-sm text-zinc-500">iOS Developer at Apple</div>
                </div>
              </div>
              <p className="text-zinc-400">
                &quot;Switched from marketing to mobile development. TechLearn made the transition smooth with their beginner-friendly Swift courses.&quot;
              </p>
              <div className="mt-4 flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="h-5 w-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-zinc-800 bg-[#030014]">
        <div className="mx-auto max-w-6xl px-6 py-12">
          {/* Footer Grid */}
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {/* Brand Column */}
            <div className="sm:col-span-2 lg:col-span-1">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-purple-600">
                  <span className="text-sm font-bold text-white">T</span>
                </div>
                <span className="text-xl font-bold text-white">TechLearn</span>
              </div>
              <p className="mt-4 text-sm text-zinc-400">
                Empowering the next generation of developers with hands-on, project-based learning.
              </p>
              {/* Social Links */}
              <div className="mt-6 flex gap-4">
                <a href="#" className="text-zinc-500 transition-colors hover:text-cyan-400">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </a>
                <a href="#" className="text-zinc-500 transition-colors hover:text-cyan-400">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                </a>
                <a href="#" className="text-zinc-500 transition-colors hover:text-cyan-400">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
                <a href="#" className="text-zinc-500 transition-colors hover:text-cyan-400">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Product Column */}
            <div>
              <h3 className="font-semibold text-white">Product</h3>
              <ul className="mt-4 space-y-3">
                <li><a href="#" className="text-sm text-zinc-400 transition-colors hover:text-cyan-400">Courses</a></li>
                <li><a href="#" className="text-sm text-zinc-400 transition-colors hover:text-cyan-400">Learning Paths</a></li>
                <li><a href="#" className="text-sm text-zinc-400 transition-colors hover:text-cyan-400">Pricing</a></li>
                <li><a href="#" className="text-sm text-zinc-400 transition-colors hover:text-cyan-400">For Teams</a></li>
              </ul>
            </div>

            {/* Company Column */}
            <div>
              <h3 className="font-semibold text-white">Company</h3>
              <ul className="mt-4 space-y-3">
                <li><a href="#" className="text-sm text-zinc-400 transition-colors hover:text-cyan-400">About Us</a></li>
                <li><a href="#" className="text-sm text-zinc-400 transition-colors hover:text-cyan-400">Careers</a></li>
                <li><a href="#" className="text-sm text-zinc-400 transition-colors hover:text-cyan-400">Blog</a></li>
                <li><a href="#" className="text-sm text-zinc-400 transition-colors hover:text-cyan-400">Press</a></li>
              </ul>
            </div>

            {/* Contact Column */}
            <div id="contact" className="scroll-mt-20">
              <h3 className="font-semibold text-white">Contact</h3>
              <ul className="mt-4 space-y-3">
                <li>
                  <a href="mailto:techlearnAI12342323@gmail.com" className="text-sm text-zinc-400 transition-colors hover:text-cyan-400">
                    techlearnAI12342323@gmail.com
                  </a>
                </li>
                <li><a href="#" className="text-sm text-zinc-400 transition-colors hover:text-cyan-400">Help Center</a></li>
                <li><a href="#" className="text-sm text-zinc-400 transition-colors hover:text-cyan-400">Support</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-zinc-800 pt-8 sm:flex-row">
            <p className="text-sm text-zinc-500">
              &copy; {new Date().getFullYear()} TechLearn. All rights reserved.
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <a href="#" className="text-sm text-zinc-500 transition-colors hover:text-zinc-300">Privacy Policy</a>
              <a href="#" className="text-sm text-zinc-500 transition-colors hover:text-zinc-300">Terms of Service</a>
              <a href="#" className="text-sm text-zinc-500 transition-colors hover:text-zinc-300">Cookie Policy</a>
              <a href="#" className="text-sm text-zinc-500 transition-colors hover:text-zinc-300">Disclaimer</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
