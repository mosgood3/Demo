import { SupabaseClient } from '@supabase/supabase-js'

export async function checkCourseAccess(
  supabase: SupabaseClient,
  userId: string,
  courseSlug: string
): Promise<boolean> {
  // Get the course ID from the slug
  const { data: course } = await supabase
    .from('courses')
    .select('id, pricing_type')
    .eq('slug', courseSlug)
    .single()

  if (!course) {
    return false
  }

  // Check for one-time purchase access
  const { data: purchase } = await supabase
    .from('user_courses')
    .select('course_id')
    .eq('user_id', userId)
    .eq('course_id', course.id)
    .single()

  if (purchase) {
    return true
  }

  // Check for active subscription
  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('id, status')
    .eq('user_id', userId)
    .eq('course_id', course.id)
    .in('status', ['active', 'trialing'])
    .single()

  return !!subscription
}

export async function getCourseAccessForUser(
  supabase: SupabaseClient,
  userId: string
): Promise<string[]> {
  // Get all course slugs from one-time purchases
  const { data: purchases } = await supabase
    .from('user_courses')
    .select('courses(slug)')
    .eq('user_id', userId)

  // Get all course slugs from active subscriptions
  const { data: subscriptions } = await supabase
    .from('subscriptions')
    .select('courses(slug)')
    .eq('user_id', userId)
    .in('status', ['active', 'trialing'])

  const slugs = new Set<string>()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  purchases?.forEach((item: any) => {
    if (item.courses?.slug) slugs.add(item.courses.slug)
  })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  subscriptions?.forEach((item: any) => {
    if (item.courses?.slug) slugs.add(item.courses.slug)
  })

  return Array.from(slugs)
}
