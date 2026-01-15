import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@/lib/supabase/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { courseSlug } = await request.json()

    if (!courseSlug) {
      return NextResponse.json({ error: 'Course slug required' }, { status: 400 })
    }

    // Get course from database with pricing info
    const { data: course, error: courseError } = await supabase
      .from('courses')
      .select('id, slug, pricing_type, price_cents')
      .eq('slug', courseSlug)
      .single()

    if (courseError || !course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 })
    }

    const isSubscription = course.pricing_type === 'subscription'

    // Check if user already has access
    if (isSubscription) {
      const { data: existingSub } = await supabase
        .from('subscriptions')
        .select('id, status')
        .eq('user_id', user.id)
        .eq('course_id', course.id)
        .in('status', ['active', 'trialing'])
        .single()

      if (existingSub) {
        return NextResponse.json({ error: 'You already have an active subscription' }, { status: 400 })
      }
    } else {
      const { data: existingAccess } = await supabase
        .from('user_courses')
        .select('course_id')
        .eq('user_id', user.id)
        .eq('course_id', course.id)
        .single()

      if (existingAccess) {
        return NextResponse.json({ error: 'You already own this course' }, { status: 400 })
      }
    }

    // For subscriptions, get or create Stripe customer
    let customerId: string | undefined
    if (isSubscription) {
      // Check if user has a Stripe customer ID
      const { data: userData } = await supabase
        .from('users')
        .select('stripe_customer_id')
        .eq('id', user.id)
        .single()

      if (userData?.stripe_customer_id) {
        customerId = userData.stripe_customer_id
      } else {
        // Create a new Stripe customer
        const customer = await stripe.customers.create({
          email: user.email,
          metadata: { user_id: user.id },
        })
        customerId = customer.id

        // Save customer ID to database
        await supabase
          .from('users')
          .update({ stripe_customer_id: customerId })
          .eq('id', user.id)
      }
    }

    // Create Stripe checkout session
    const sessionConfig: Stripe.Checkout.SessionCreateParams = {
      ui_mode: 'embedded',
      payment_method_types: ['card'],
      return_url: `${request.nextUrl.origin}/course/${courseSlug}?lesson=1&session_id={CHECKOUT_SESSION_ID}`,
      metadata: {
        user_id: user.id,
        course_id: course.id,
        course_slug: courseSlug,
      },
    }

    if (isSubscription) {
      // Subscription checkout
      sessionConfig.mode = 'subscription'
      sessionConfig.customer = customerId
      sessionConfig.line_items = [
        {
          price_data: {
            currency: 'usd',
            unit_amount: course.price_cents || 999,
            product_data: {
              name: `${course.slug} (Monthly)`,
            },
            recurring: {
              interval: 'month',
            },
          },
          quantity: 1,
        },
      ]
      sessionConfig.subscription_data = {
        metadata: {
          user_id: user.id,
          course_id: course.id,
          course_slug: courseSlug,
        },
      }
    } else {
      // One-time payment checkout
      sessionConfig.mode = 'payment'
      sessionConfig.line_items = [
        {
          price_data: {
            currency: 'usd',
            unit_amount: course.price_cents || 1999,
            product_data: {
              name: course.slug,
            },
          },
          quantity: 1,
        },
      ]
    }

    const session = await stripe.checkout.sessions.create(sessionConfig)

    return NextResponse.json({ clientSecret: session.client_secret })
  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
