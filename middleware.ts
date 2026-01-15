import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { pathname, searchParams } = request.nextUrl

  // Check if this is a course page
  if (pathname.startsWith('/course/')) {
    const lessonParam = searchParams.get('lesson')
    const lessonId = lessonParam ? parseInt(lessonParam) : 1

    // Lesson 1 is always free - no check needed
    if (lessonId > 1) {
      // Extract course slug from pathname
      const slug = pathname.split('/course/')[1]?.split('/')[0]

      if (!slug) {
        return supabaseResponse
      }

      // If not logged in, redirect to lesson 1
      if (!user) {
        const url = request.nextUrl.clone()
        url.searchParams.set('lesson', '1')
        url.searchParams.set('locked', 'true')
        return NextResponse.redirect(url)
      }

      // Get the course ID first
      const { data: course } = await supabase
        .from('courses')
        .select('id')
        .eq('slug', slug)
        .single()

      if (!course) {
        // Course doesn't exist in DB, allow access (frontend-only course)
        return supabaseResponse
      }

      // Check if user has access to this course
      const { data: courseAccess } = await supabase
        .from('user_courses')
        .select('course_id')
        .eq('user_id', user.id)
        .eq('course_id', course.id)
        .single()

      // If no access, redirect to lesson 1
      if (!courseAccess) {
        const url = request.nextUrl.clone()
        url.searchParams.set('lesson', '1')
        url.searchParams.set('locked', 'true')
        return NextResponse.redirect(url)
      }
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/course/:path*'],
}
