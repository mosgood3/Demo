'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import EmbeddedCheckoutModal from '@/components/EmbeddedCheckout';

// Mock course data - replace with real data later
const courseData: Record<string, {
  title: string;
  modules: {
    id: number;
    title: string;
    lessons: {
      id: number;
      title: string;
      duration: string;
      completed: boolean;
    }[];
  }[];
}> = {
  'nextjs-fundamentals': {
    title: 'Next.js Fundamentals',
    modules: [
      {
        id: 1,
        title: 'Getting Started',
        lessons: [
          { id: 1, title: 'Introduction to Next.js', duration: '8:30', completed: true },
          { id: 2, title: 'Setting Up Your Environment', duration: '12:15', completed: true },
          { id: 3, title: 'Creating Your First App', duration: '15:00', completed: true },
        ],
      },
      {
        id: 2,
        title: 'Routing & Navigation',
        lessons: [
          { id: 4, title: 'File-Based Routing', duration: '10:45', completed: true },
          { id: 5, title: 'Dynamic Routes', duration: '14:20', completed: true },
          { id: 6, title: 'Link Component', duration: '8:00', completed: false },
          { id: 7, title: 'Programmatic Navigation', duration: '11:30', completed: false },
        ],
      },
      {
        id: 3,
        title: 'Data Fetching',
        lessons: [
          { id: 8, title: 'Server Components', duration: '16:00', completed: false },
          { id: 9, title: 'Client Components', duration: '12:45', completed: false },
          { id: 10, title: 'API Routes', duration: '18:30', completed: false },
        ],
      },
      {
        id: 4,
        title: 'Styling & Assets',
        lessons: [
          { id: 11, title: 'CSS Modules', duration: '9:15', completed: false },
          { id: 12, title: 'Tailwind CSS Integration', duration: '14:00', completed: false },
          { id: 13, title: 'Image Optimization', duration: '11:20', completed: false },
          { id: 14, title: 'Font Optimization', duration: '7:45', completed: false },
        ],
      },
    ],
  },
};

// Default course for unknown slugs
const defaultCourse = {
  title: 'Course',
  modules: [
    {
      id: 1,
      title: 'Module 1',
      lessons: [
        { id: 1, title: 'Lesson 1', duration: '10:00', completed: false },
        { id: 2, title: 'Lesson 2', duration: '12:00', completed: false },
      ],
    },
  ],
};

export default function CourseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const slug = params.slug as string;
  const currentLessonId = parseInt(searchParams.get('lesson') || '1');

  const course = courseData[slug] || defaultCourse;

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/');
  };

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedModules, setExpandedModules] = useState<number[]>([1, 2]);
  const [hasAccess, setHasAccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showLockedBanner, setShowLockedBanner] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [subscription, setSubscription] = useState<{
    status: string;
    currentPeriodEnd: string;
    cancelAtPeriodEnd: boolean;
  } | null>(null);
  const [isCanceling, setIsCanceling] = useState(false);

  useEffect(() => {
    // Check if redirected from a locked lesson
    if (searchParams.get('locked') === 'true') {
      setShowLockedBanner(true);
      // Remove the locked param from URL without refresh
      const url = new URL(window.location.href);
      url.searchParams.delete('locked');
      window.history.replaceState({}, '', url.toString());
    }
  }, [searchParams]);

  useEffect(() => {
    async function checkAccess() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      console.log('[CourseAccess] Checking access for slug:', slug);
      console.log('[CourseAccess] User:', user?.id);

      if (!user) {
        console.log('[CourseAccess] No user, setting hasAccess=false');
        setHasAccess(false);
        setIsLoading(false);
        return;
      }

      // Get course by slug
      const { data: dbCourse, error: courseError } = await supabase
        .from('courses')
        .select('id')
        .eq('slug', slug)
        .single();

      console.log('[CourseAccess] Course lookup result:', { dbCourse, courseError });

      if (courseError || !dbCourse) {
        // Course not in DB - default to no access (paid content)
        console.log('[CourseAccess] Course not found in DB, setting hasAccess=false');
        setHasAccess(false);
        setIsLoading(false);
        return;
      }

      // Check if user has one-time purchase access
      const { data: purchase } = await supabase
        .from('user_courses')
        .select('course_id')
        .eq('user_id', user.id)
        .eq('course_id', dbCourse.id)
        .single();

      if (purchase) {
        console.log('[CourseAccess] User has one-time purchase access');
        setHasAccess(true);
        setIsLoading(false);
        return;
      }

      // Check if user has active subscription
      const { data: subscriptionData } = await supabase
        .from('subscriptions')
        .select('id, status, current_period_end, cancel_at_period_end')
        .eq('user_id', user.id)
        .eq('course_id', dbCourse.id)
        .in('status', ['active', 'trialing'])
        .single();

      console.log('[CourseAccess] Subscription check result:', subscriptionData);
      console.log('[CourseAccess] Setting hasAccess=', !!subscriptionData);

      if (subscriptionData) {
        setSubscription({
          status: subscriptionData.status,
          currentPeriodEnd: subscriptionData.current_period_end,
          cancelAtPeriodEnd: subscriptionData.cancel_at_period_end,
        });
      }

      setHasAccess(!!subscriptionData);
      setIsLoading(false);
    }

    checkAccess();
  }, [slug]);

  const toggleModule = (moduleId: number) => {
    setExpandedModules(prev =>
      prev.includes(moduleId)
        ? prev.filter(id => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  const handleCheckout = () => {
    setShowCheckout(true);
  };

  const handleCancelSubscription = async () => {
    if (!confirm('Are you sure you want to cancel your subscription? You will retain access until the end of your billing period.')) {
      return;
    }

    setIsCanceling(true);
    try {
      const response = await fetch('/api/stripe/subscription/cancel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseSlug: slug }),
      });

      const data = await response.json();

      if (response.ok) {
        setSubscription(prev => prev ? { ...prev, cancelAtPeriodEnd: true } : null);
        alert('Your subscription has been canceled. You will retain access until ' +
          new Date(subscription?.currentPeriodEnd || '').toLocaleDateString());
      } else {
        alert(data.error || 'Failed to cancel subscription');
      }
    } catch (error) {
      console.error('Cancel error:', error);
      alert('Failed to cancel subscription');
    } finally {
      setIsCanceling(false);
    }
  };

  const getModuleProgress = (module: typeof course.modules[0]) => {
    const completed = module.lessons.filter(l => l.completed).length;
    return Math.round((completed / module.lessons.length) * 100);
  };

  return (
    <div className="min-h-screen bg-[#030014]">
      {/* Top Header */}
      <header className="fixed left-0 right-0 top-0 z-50 border-b border-zinc-800/50 bg-[#030014]/95 backdrop-blur-md">
        <div className="flex h-16 items-center justify-between px-4 lg:px-6">
          {/* Left side: Menu button + Logo */}
          <div className="flex items-center gap-4">
            {/* Mobile menu button */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="flex h-10 w-10 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-white lg:hidden"
              aria-label="Toggle sidebar"
            >
              {sidebarOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>

            {/* Logo */}
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-purple-600">
                <span className="text-sm font-bold text-white">T</span>
              </div>
              <span className="hidden text-xl font-bold text-white sm:block">TechLearn</span>
            </Link>

            {/* Course title */}
            <div className="hidden items-center gap-2 md:flex">
              <svg className="h-5 w-5 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <span className="text-sm font-medium text-zinc-300">{course.title}</span>
            </div>
          </div>

          {/* Right side: User menu */}
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="hidden items-center gap-2 rounded-lg px-3 py-2 text-sm text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-white sm:flex"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Dashboard
            </Link>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 text-sm font-bold text-white">
              JD
            </div>
            <button
              onClick={handleSignOut}
              className="rounded-lg border border-zinc-700 bg-zinc-800/50 px-3 py-1.5 text-sm text-zinc-300 transition-all hover:border-zinc-600 hover:bg-zinc-800 hover:text-white"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed bottom-0 left-0 top-16 z-40 w-80 transform overflow-y-auto border-r border-zinc-800/50 bg-[#030014] transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-4">
          {/* Course progress header */}
          <div className="mb-6 rounded-lg border border-zinc-800 bg-zinc-900/50 p-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium text-zinc-300">Course Progress</span>
              <span className="text-sm font-bold text-cyan-400">65%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-zinc-800">
              <div className="h-full w-[65%] rounded-full bg-gradient-to-r from-cyan-500 to-purple-600" />
            </div>
          </div>

          {/* Unlock full course CTA */}
          {!isLoading && !hasAccess && (
            <div className="mb-6 rounded-lg border border-purple-500/30 bg-gradient-to-br from-purple-500/10 to-cyan-500/10 p-4">
              <div className="mb-3 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/20">
                  <svg className="h-4 w-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <span className="text-sm font-semibold text-white">Unlock Full Course</span>
              </div>
              <p className="mb-4 text-xs text-zinc-400">
                Get access to all lessons, code examples, and future updates.
              </p>
              <button
                onClick={handleCheckout}
                className="w-full rounded-lg bg-gradient-to-r from-purple-500 to-cyan-500 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:from-purple-400 hover:to-cyan-400"
              >
                Purchase Access
              </button>
            </div>
          )}

          {/* Subscription Management */}
          {!isLoading && hasAccess && subscription && (
            <div className="mb-6 rounded-lg border border-green-500/30 bg-green-500/5 p-4">
              <div className="mb-3 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-500/20">
                  <svg className="h-4 w-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-sm font-semibold text-white">Subscription Active</span>
              </div>

              <div className="mb-3 space-y-1 text-xs text-zinc-400">
                <p>
                  Status: <span className="text-green-400 capitalize">{subscription.status}</span>
                </p>
                <p>
                  {subscription.cancelAtPeriodEnd ? 'Access until: ' : 'Renews: '}
                  <span className="text-zinc-300">
                    {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
                  </span>
                </p>
              </div>

              {subscription.cancelAtPeriodEnd ? (
                <div className="rounded-lg bg-yellow-500/10 border border-yellow-500/20 px-3 py-2">
                  <p className="text-xs text-yellow-400">
                    Your subscription is canceled and will end on{' '}
                    {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
                  </p>
                </div>
              ) : (
                <button
                  onClick={handleCancelSubscription}
                  disabled={isCanceling}
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-800/50 px-4 py-2 text-sm text-zinc-400 transition-all hover:border-red-500/50 hover:bg-red-500/10 hover:text-red-400 disabled:opacity-50"
                >
                  {isCanceling ? 'Canceling...' : 'Cancel Subscription'}
                </button>
              )}
            </div>
          )}

          {/* Modules */}
          <nav className="space-y-2">
            {course.modules.map((module) => {
              const isExpanded = expandedModules.includes(module.id);
              const progress = getModuleProgress(module);
              const hasCurrentLesson = module.lessons.some(l => l.id === currentLessonId);

              return (
                <div key={module.id} className="rounded-lg border border-zinc-800/50 overflow-hidden">
                  {/* Module header */}
                  <button
                    onClick={() => toggleModule(module.id)}
                    className={`flex w-full items-center justify-between p-3 text-left transition-colors ${
                      hasCurrentLesson ? 'bg-zinc-800/50' : 'hover:bg-zinc-800/30'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold ${
                        progress === 100
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-zinc-800 text-zinc-400'
                      }`}>
                        {progress === 100 ? (
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          module.id
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{module.title}</p>
                        <p className="text-xs text-zinc-500">{module.lessons.length} lessons</p>
                      </div>
                    </div>
                    <svg
                      className={`h-5 w-5 text-zinc-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Lessons list */}
                  {isExpanded && (
                    <div className="border-t border-zinc-800/50 bg-zinc-900/30">
                      {module.lessons.map((lesson) => {
                        const isActive = lesson.id === currentLessonId;
                        // If user is viewing lesson > 1, they have access (middleware would have blocked otherwise)
                        const effectiveHasAccess = hasAccess || currentLessonId > 1;
                        const isLocked = !effectiveHasAccess && lesson.id > 1;

                        if (isLocked) {
                          return (
                            <div
                              key={lesson.id}
                              className="flex items-center gap-3 px-4 py-3 border-l-2 border-transparent opacity-60 cursor-not-allowed"
                            >
                              {/* Lock icon */}
                              <div className="flex h-5 w-5 items-center justify-center rounded-full border border-zinc-600 bg-zinc-800">
                                <svg className="h-3 w-3 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                              </div>

                              <div className="flex-1 min-w-0">
                                <p className="text-sm truncate text-zinc-500">
                                  {lesson.title}
                                </p>
                                <p className="text-xs text-zinc-600">{lesson.duration}</p>
                              </div>

                              {/* Lock badge */}
                              <span className="text-xs text-zinc-600 bg-zinc-800 px-2 py-0.5 rounded">
                                Locked
                              </span>
                            </div>
                          );
                        }

                        return (
                          <Link
                            key={lesson.id}
                            href={`/course/${slug}?lesson=${lesson.id}`}
                            onClick={() => setSidebarOpen(false)}
                            className={`flex items-center gap-3 px-4 py-3 transition-colors ${
                              isActive
                                ? 'bg-cyan-500/10 border-l-2 border-cyan-500'
                                : 'hover:bg-zinc-800/30 border-l-2 border-transparent'
                            }`}
                          >
                            {/* Completion indicator */}
                            <div className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                              lesson.completed
                                ? 'border-green-500 bg-green-500'
                                : isActive
                                ? 'border-cyan-500'
                                : 'border-zinc-600'
                            }`}>
                              {lesson.completed && (
                                <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                              )}
                            </div>

                            <div className="flex-1 min-w-0">
                              <p className={`text-sm truncate ${
                                isActive ? 'text-cyan-400 font-medium' : 'text-zinc-300'
                              }`}>
                                {lesson.title}
                              </p>
                              <p className="text-xs text-zinc-500">{lesson.duration}</p>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Main content */}
      <main className="pt-16 lg:pl-80">
        {/* Locked content banner */}
        {showLockedBanner && (
          <div className="border-b border-yellow-500/20 bg-yellow-500/10 px-4 py-3">
            <div className="mx-auto flex max-w-4xl items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <svg className="h-5 w-5 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <p className="text-sm text-yellow-200">
                  <span className="font-medium">This lesson is locked.</span>{' '}
                  Purchase the course to unlock all lessons.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCheckout}
                  className="rounded-lg bg-yellow-500 px-4 py-1.5 text-sm font-medium text-black transition-colors hover:bg-yellow-400"
                >
                  Unlock Course
                </button>
                <button
                  onClick={() => setShowLockedBanner(false)}
                  className="rounded-lg p-1.5 text-yellow-500 transition-colors hover:bg-yellow-500/20"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}
        <div className="min-h-[calc(100vh-4rem)]">
          {children}
        </div>
      </main>

      {/* Embedded Checkout Modal */}
      {showCheckout && (
        <EmbeddedCheckoutModal
          courseSlug={slug}
          onClose={() => setShowCheckout(false)}
        />
      )}
    </div>
  );
}
