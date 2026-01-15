'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

const courses = [
  {
    id: 1,
    slug: 'one-time',
    title: 'One-Time',
    description: 'Get lifetime access to all course materials with a single payment',
    thumbnail: 'from-cyan-500 to-blue-600',
  },
  {
    id: 2,
    slug: 'subscription',
    title: 'Subscription',
    description: 'Access all courses with a monthly or yearly subscription plan',
    thumbnail: 'from-purple-500 to-pink-600',
  },
];

export default function DashboardPage() {
  const router = useRouter();

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-[#030014]">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 border-b border-zinc-800/50 bg-[#030014]/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-purple-600">
              <span className="text-sm font-bold text-white">T</span>
            </div>
            <span className="text-xl font-bold text-white">TechLearn</span>
          </Link>

          <div className="flex items-center gap-4">
            {/* User Menu */}
            <div className="flex items-center gap-3">
              <div className="hidden text-right sm:block">
                <p className="text-sm font-medium text-white">John Doe</p>
                <p className="text-xs text-zinc-500">Premium Member</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 text-sm font-bold text-white">
                JD
              </div>
            </div>
            <button
              onClick={handleSignOut}
              className="rounded-lg border border-zinc-700 bg-zinc-800/50 px-4 py-2 text-sm text-zinc-300 transition-all hover:border-zinc-600 hover:bg-zinc-800 hover:text-white"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Welcome back, John!</h1>
          <p className="mt-2 text-zinc-400">Continue where you left off or explore new courses.</p>
        </div>

        {/* Courses Section */}
        <section>
          <div className="grid gap-6 sm:grid-cols-2">
            {courses.map((course) => (
              <Link
                key={course.id}
                href={`/course/${course.slug}`}
                className="group rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 transition-all hover:border-cyan-500/30 hover:bg-zinc-900/80"
              >
                {/* Course Thumbnail */}
                <div className={`mb-4 flex h-40 items-center justify-center rounded-lg bg-gradient-to-br ${course.thumbnail}`}>
                  <svg className="h-16 w-16 text-white/80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>

                {/* Course Info */}
                <h3 className="text-xl font-semibold text-white group-hover:text-cyan-400">
                  {course.title}
                </h3>
                <p className="mt-2 text-sm text-zinc-500">
                  {course.description}
                </p>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
