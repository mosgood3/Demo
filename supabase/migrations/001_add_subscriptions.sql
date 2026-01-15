-- ============================================
-- ADD STRIPE CUSTOMER ID TO USERS
-- ============================================
ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT UNIQUE;

-- ============================================
-- ADD PRICING TYPE TO COURSES
-- ============================================
ALTER TABLE public.courses
ADD COLUMN IF NOT EXISTS pricing_type TEXT NOT NULL DEFAULT 'one_time';
-- pricing_type: 'one_time' or 'subscription'

ALTER TABLE public.courses
ADD COLUMN IF NOT EXISTS price_cents INTEGER DEFAULT 1999;

-- ============================================
-- SUBSCRIPTIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
  stripe_subscription_id TEXT UNIQUE NOT NULL,
  stripe_price_id TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  -- status: 'active', 'canceled', 'past_due', 'unpaid', 'trialing'
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, course_id)
);

ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own subscriptions"
  ON public.subscriptions FOR SELECT
  USING (auth.uid() = user_id);

-- ============================================
-- INSERT SAMPLE COURSES
-- ============================================
-- One-time purchase course
INSERT INTO public.courses (slug, pricing_type, price_cents)
VALUES ('one-time', 'one_time', 1999)
ON CONFLICT (slug) DO UPDATE SET pricing_type = 'one_time', price_cents = 1999;

-- Subscription course
INSERT INTO public.courses (slug, pricing_type, price_cents)
VALUES ('subscription', 'subscription', 999)
ON CONFLICT (slug) DO UPDATE SET pricing_type = 'subscription', price_cents = 999;
