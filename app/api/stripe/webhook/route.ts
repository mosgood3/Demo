import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

// Use service role for webhook to bypass RLS
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  console.log(`[Webhook] Received event: ${event.type}`)

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session

      const userId = session.metadata?.user_id
      const courseId = session.metadata?.course_id

      if (!userId || !courseId) {
        console.error('Missing metadata in checkout session')
        return NextResponse.json({ error: 'Missing metadata' }, { status: 400 })
      }

      if (session.mode === 'payment') {
        // One-time payment - grant permanent access
        const { error: accessError } = await supabase
          .from('user_courses')
          .insert({
            user_id: userId,
            course_id: courseId,
          })

        if (accessError && accessError.code !== '23505') {
          console.error('Failed to grant course access:', accessError)
          return NextResponse.json({ error: 'Failed to grant access' }, { status: 500 })
        }

        // Record the transaction
        await supabase.from('payment_transactions').insert({
          user_id: userId,
          course_id: courseId,
          stripe_payment_intent_id: session.payment_intent as string,
          amount_cents: session.amount_total || 0,
          status: 'succeeded',
        })

        console.log(`[Webhook] One-time access granted: user=${userId}, course=${courseId}`)
      } else if (session.mode === 'subscription') {
        // Subscription - handled by customer.subscription.created
        console.log(`[Webhook] Subscription checkout completed: user=${userId}, course=${courseId}`)
      }
      break
    }

    case 'customer.subscription.created':
    case 'customer.subscription.updated': {
      const subscription = event.data.object as Stripe.Subscription
      const metadata = subscription.metadata

      const userId = metadata?.user_id
      const courseId = metadata?.course_id

      if (!userId || !courseId) {
        console.error('Missing metadata in subscription')
        return NextResponse.json({ error: 'Missing metadata' }, { status: 400 })
      }

      // Get period from subscription items (Stripe API v2022-11-15+)
      const subscriptionItem = subscription.items?.data[0]
      const periodStart = subscriptionItem?.current_period_start
      const periodEnd = subscriptionItem?.current_period_end

      // Upsert subscription record
      const { error: subError } = await supabase
        .from('subscriptions')
        .upsert({
          user_id: userId,
          course_id: courseId,
          stripe_subscription_id: subscription.id,
          status: subscription.status,
          current_period_start: periodStart
            ? new Date(periodStart * 1000).toISOString()
            : null,
          current_period_end: periodEnd
            ? new Date(periodEnd * 1000).toISOString()
            : null,
          cancel_at_period_end: subscription.cancel_at_period_end,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'stripe_subscription_id',
        })

      if (subError) {
        console.error('Failed to upsert subscription:', subError)
        return NextResponse.json({ error: 'Failed to update subscription' }, { status: 500 })
      }

      console.log(`[Webhook] Subscription ${event.type}: user=${userId}, status=${subscription.status}`)
      break
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription

      // Update subscription status to canceled
      const { error } = await supabase
        .from('subscriptions')
        .update({
          status: 'canceled',
          updated_at: new Date().toISOString(),
        })
        .eq('stripe_subscription_id', subscription.id)

      if (error) {
        console.error('Failed to cancel subscription:', error)
      }

      console.log(`[Webhook] Subscription canceled: ${subscription.id}`)
      break
    }

    case 'invoice.payment_succeeded': {
      const invoice = event.data.object as Stripe.Invoice

      // Get subscription ID from parent (Stripe API v2024-12-18+)
      const subscriptionId = invoice.parent?.subscription_details?.subscription
        ?? (invoice as unknown as { subscription?: string }).subscription

      if (subscriptionId) {
        // Get subscription from our database to find user/course
        const { data: sub } = await supabase
          .from('subscriptions')
          .select('user_id, course_id')
          .eq('stripe_subscription_id', subscriptionId)
          .single()

        if (sub) {
          // Get payment intent from payments array (Stripe API v2024-12-18+)
          const paymentIntentId = invoice.payments?.data[0]?.payment?.payment_intent
            ?? (invoice as unknown as { payment_intent?: string }).payment_intent

          await supabase.from('payment_transactions').insert({
            user_id: sub.user_id,
            course_id: sub.course_id,
            stripe_payment_intent_id: paymentIntentId ?? invoice.id,
            amount_cents: invoice.amount_paid ?? 0,
            status: 'succeeded',
          })
        }
      }

      console.log(`[Webhook] Invoice payment succeeded: ${invoice.id}`)
      break
    }

    case 'invoice.payment_failed': {
      const invoice = event.data.object as Stripe.Invoice

      // Get subscription ID from parent (Stripe API v2024-12-18+)
      const subscriptionId = invoice.parent?.subscription_details?.subscription
        ?? (invoice as unknown as { subscription?: string }).subscription

      if (subscriptionId) {
        // Update subscription status
        await supabase
          .from('subscriptions')
          .update({
            status: 'past_due',
            updated_at: new Date().toISOString(),
          })
          .eq('stripe_subscription_id', subscriptionId)
      }

      console.log(`[Webhook] Invoice payment failed: ${invoice.id}`)
      break
    }

    default:
      console.log(`[Webhook] Unhandled event type: ${event.type}`)
  }

  return NextResponse.json({ received: true })
}
