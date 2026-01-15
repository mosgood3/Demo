'use client';

import { useParams, useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

// Mock lesson content data
const lessonsContent: Record<number, {
  title: string;
  videoUrl?: string;
  content: string;
  nextLessonId?: number;
  prevLessonId?: number;
}> = {
  1: {
    title: 'Introduction to Next.js',
    content: `
![Introduction](https://mujfvmkpcrtwzjagqwif.supabase.co/storage/v1/object/sign/Images2/me.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9kNjFhNTA0My02NWNhLTQ5NTktYWNkNy1mMDcxNjAzNDhkMTkiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJJbWFnZXMyL21lLnBuZyIsImlhdCI6MTc2Nzk5Njg3NywiZXhwIjoyMDgzMzU2ODc3fQ.R7lmjLQ6QK-LURNAfeF9Kcf9Vu6KyKYyM3KbPhDUNk4)

## What is Next.js?

Next.js is a React framework that enables you to build full-stack web applications. It provides features like:

- **Server-Side Rendering (SSR)** - Pages are rendered on the server for better SEO and performance
- **Static Site Generation (SSG)** - Pre-render pages at build time
- **File-Based Routing** - Create routes by adding files to the pages directory
- **API Routes** - Build API endpoints as part of your Next.js app
- **Built-in CSS Support** - Import CSS files directly in your components

### Why Choose Next.js?

Next.js simplifies the process of building production-ready React applications by handling:

1. Code splitting and bundling
2. Image optimization
3. TypeScript support out of the box
4. Fast refresh for development
5. Zero configuration needed

### Prerequisites

Before starting this course, you should have:

- Basic knowledge of HTML, CSS, and JavaScript
- Familiarity with React fundamentals
- Node.js installed on your machine

Let's dive in and start building!
    `,
    nextLessonId: 2,
  },
  2: {
    title: 'Setting Up Your Environment',
    content: `
## Development Environment Setup

In this lesson, we'll set up everything you need to start developing with Next.js.

### Installing Node.js

First, ensure you have Node.js installed. We recommend version 18 or later.

\`\`\`bash
# Check your Node.js version
node --version

# Should output v18.x.x or higher
\`\`\`

### Creating a New Next.js Project

Use the create-next-app CLI to bootstrap a new project:

\`\`\`bash
npx create-next-app@latest my-app
cd my-app
npm run dev
\`\`\`

### Project Structure

After creation, your project will have this structure:

\`\`\`
my-app/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── public/
├── package.json
└── next.config.js
\`\`\`

### Running the Development Server

Start the development server with:

\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) in your browser to see your app!
    `,
    prevLessonId: 1,
    nextLessonId: 3,
  },
  3: {
    title: 'Creating Your First App',
    content: `
## Building Your First Next.js Application

Now let's create something real! We'll build a simple homepage with navigation.

### Modifying the Home Page

Open \`app/page.tsx\` and replace its contents:

\`\`\`tsx
export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <h1 className="text-4xl font-bold">
        Welcome to My App
      </h1>
      <p className="mt-4 text-gray-600">
        Built with Next.js
      </p>
    </main>
  );
}
\`\`\`

### Adding Styles

Next.js supports CSS Modules, Tailwind CSS, and more. Let's add some basic styling:

\`\`\`css
/* app/globals.css */
body {
  font-family: system-ui, sans-serif;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}
\`\`\`

### Creating Additional Pages

Add a new page by creating a file at \`app/about/page.tsx\`:

\`\`\`tsx
export default function About() {
  return (
    <main className="min-h-screen p-8">
      <h1 className="text-4xl font-bold">About Us</h1>
      <p className="mt-4">Learn more about our company.</p>
    </main>
  );
}
\`\`\`

Visit \`/about\` to see your new page!
    `,
    prevLessonId: 2,
    nextLessonId: 4,
  },
  4: {
    title: 'File-Based Routing',
    content: `
## Understanding File-Based Routing

One of Next.js's most powerful features is its file-based routing system.

### How It Works

The \`app\` directory structure directly maps to URL paths:

| File Path | URL |
|-----------|-----|
| \`app/page.tsx\` | \`/\` |
| \`app/about/page.tsx\` | \`/about\` |
| \`app/blog/page.tsx\` | \`/blog\` |
| \`app/blog/[slug]/page.tsx\` | \`/blog/:slug\` |

### Creating Nested Routes

Create nested folders for nested routes:

\`\`\`
app/
├── page.tsx          → /
├── about/
│   └── page.tsx      → /about
├── products/
│   ├── page.tsx      → /products
│   └── [id]/
│       └── page.tsx  → /products/:id
\`\`\`

### Route Groups

Use parentheses to organize routes without affecting the URL:

\`\`\`
app/
├── (marketing)/
│   ├── about/page.tsx    → /about
│   └── contact/page.tsx  → /contact
├── (shop)/
│   └── products/page.tsx → /products
\`\`\`

This is great for applying different layouts to different sections!
    `,
    prevLessonId: 3,
    nextLessonId: 5,
  },
  5: {
    title: 'Dynamic Routes',
    content: `
## Dynamic Routes in Next.js

Dynamic routes allow you to create pages that match patterns like \`/blog/my-post\` or \`/users/123\`.

### Creating Dynamic Segments

Use square brackets to define dynamic segments:

\`\`\`tsx
// app/blog/[slug]/page.tsx
export default function BlogPost({
  params
}: {
  params: { slug: string }
}) {
  return (
    <article>
      <h1>Post: {params.slug}</h1>
    </article>
  );
}
\`\`\`

### Catch-All Segments

Use \`[...slug]\` to catch all subsequent segments:

\`\`\`tsx
// app/docs/[...slug]/page.tsx
// Matches: /docs/a, /docs/a/b, /docs/a/b/c, etc.

export default function Docs({
  params
}: {
  params: { slug: string[] }
}) {
  return <div>Path: {params.slug.join('/')}</div>;
}
\`\`\`

### Optional Catch-All

Use \`[[...slug]]\` for optional catch-all:

\`\`\`tsx
// app/shop/[[...slug]]/page.tsx
// Matches: /shop, /shop/a, /shop/a/b, etc.
\`\`\`

This gives you incredible flexibility in your routing!
    `,
    prevLessonId: 4,
    nextLessonId: 6,
  },
  6: {
    title: 'Link Component',
    content: `
## Client-Side Navigation with Link

The \`Link\` component enables client-side navigation between pages.

### Basic Usage

\`\`\`tsx
import Link from 'next/link';

export default function Navigation() {
  return (
    <nav>
      <Link href="/">Home</Link>
      <Link href="/about">About</Link>
      <Link href="/contact">Contact</Link>
    </nav>
  );
}
\`\`\`

### Dynamic Links

\`\`\`tsx
const posts = [
  { id: 1, slug: 'hello-world' },
  { id: 2, slug: 'nextjs-tips' },
];

export default function BlogList() {
  return (
    <ul>
      {posts.map((post) => (
        <li key={post.id}>
          <Link href={\`/blog/\${post.slug}\`}>
            {post.slug}
          </Link>
        </li>
      ))}
    </ul>
  );
}
\`\`\`

### Prefetching

Links are automatically prefetched when they appear in the viewport:

\`\`\`tsx
// Disable prefetching if needed
<Link href="/heavy-page" prefetch={false}>
  Heavy Page
</Link>
\`\`\`

This makes navigation feel instant!
    `,
    prevLessonId: 5,
    nextLessonId: 7,
  },
};

// Default lesson content
const defaultLesson = {
  title: 'Lesson',
  content: 'This lesson content is coming soon. Stay tuned!',
};

export default function CoursePage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const slug = params.slug as string;
  const lessonId = parseInt(searchParams.get('lesson') || '1');

  const lesson = lessonsContent[lessonId] || defaultLesson;

  const handleMarkComplete = () => {
    if (lesson.nextLessonId) {
      router.push(`/course/${slug}?lesson=${lesson.nextLessonId}`);
    }
  };

  return (
    <div className="px-4 py-8 lg:px-8">
      <div className="mx-auto max-w-4xl">
        {/* Video placeholder */}
        <div className="mb-8 aspect-video overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900">
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-zinc-800">
                <svg className="h-10 w-10 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-lg font-medium text-white">Video Lesson</p>
              <p className="mt-1 text-sm text-zinc-500">Click to play</p>
            </div>
          </div>
        </div>

        {/* Lesson header */}
        <div className="mb-8">
          <div className="mb-2 flex items-center gap-2">
            <span className="rounded-full bg-cyan-500/20 px-3 py-1 text-xs font-medium text-cyan-400">
              Lesson {lessonId}
            </span>
          </div>
          <h1 className="text-3xl font-bold text-white">{lesson.title}</h1>
        </div>

        {/* Lesson content */}
        <div className="prose prose-invert prose-zinc max-w-none">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 lg:p-8">
            {/* Render markdown-like content */}
            <div
              className="space-y-4 text-zinc-300
                [&_h2]:mt-8 [&_h2]:mb-4 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-white
                [&_h3]:mt-6 [&_h3]:mb-3 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-white
                [&_p]:leading-relaxed
                [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2
                [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:space-y-2
                [&_li]:text-zinc-300
                [&_strong]:text-white [&_strong]:font-semibold
                [&_code]:rounded [&_code]:bg-zinc-800 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-sm [&_code]:text-cyan-400
                [&_pre]:my-4 [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:bg-zinc-800/50 [&_pre]:p-4
                [&_pre_code]:bg-transparent [&_pre_code]:p-0
                [&_a]:text-cyan-400 [&_a]:underline [&_a]:underline-offset-2 hover:[&_a]:text-cyan-300
                [&_table]:w-full [&_table]:my-4
                [&_th]:border [&_th]:border-zinc-700 [&_th]:bg-zinc-800 [&_th]:px-4 [&_th]:py-2 [&_th]:text-left [&_th]:text-white
                [&_td]:border [&_td]:border-zinc-700 [&_td]:px-4 [&_td]:py-2
              "
              dangerouslySetInnerHTML={{
                __html: lesson.content
                  .replace(/!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1" class="rounded-lg my-4 max-w-full" />')
                  .replace(/^## (.*$)/gm, '<h2>$1</h2>')
                  .replace(/^### (.*$)/gm, '<h3>$1</h3>')
                  .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                  .replace(/`([^`]+)`/g, '<code>$1</code>')
                  .replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre><code>$2</code></pre>')
                  .replace(/^\| (.*) \|$/gm, (match, content) => {
                    const cells = content.split(' | ');
                    return `<tr>${cells.map((c: string) => `<td>${c}</td>`).join('')}</tr>`;
                  })
                  .replace(/^- (.*$)/gm, '<li>$1</li>')
                  .replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>')
                  .replace(/^\d+\. (.*$)/gm, '<li>$1</li>')
                  .replace(/\n\n/g, '</p><p>')
                  .replace(/^\s*<p>/, '<p>')
              }}
            />
          </div>
        </div>

        {/* Navigation buttons */}
        <div className="mt-8 flex items-center justify-between">
          {lesson.prevLessonId ? (
            <Link
              href={`/course/${slug}?lesson=${lesson.prevLessonId}`}
              className="flex items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-800/50 px-4 py-2 text-sm font-medium text-zinc-300 transition-all hover:border-zinc-600 hover:bg-zinc-800 hover:text-white"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Previous Lesson
            </Link>
          ) : (
            <div />
          )}

          {lesson.nextLessonId ? (
            <button
              onClick={handleMarkComplete}
              className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-cyan-500 to-purple-600 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:opacity-90 hover:shadow-lg hover:shadow-cyan-500/25"
            >
              Mark Complete & Continue
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          ) : (
            <button className="flex items-center gap-2 rounded-lg bg-green-600 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-green-500">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Complete Course
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
