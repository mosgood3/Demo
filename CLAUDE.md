# Tech Education Platform

## Project Overview
A web application for teaching users how to build apps and other tech-related skills through structured courses and hands-on learning.

## Tech Stack
- Next.js (App Router)
- TypeScript
- React

## Core Features
- Course catalog with tech/programming topics
- User authentication and profiles
- Progress tracking for enrolled courses
- Interactive code examples and exercises
- Video and text-based lessons

## Project Structure
```
app/
  ├── (marketing)/     # Landing pages, pricing, about
  ├── courses/         # Course catalog and course pages
  ├── dashboard/       # User dashboard and progress
  ├── learn/           # Active learning/lesson views
  └── api/             # API routes
components/
  ├── ui/              # Reusable UI components
  ├── course/          # Course-related components
  └── layout/          # Layout components
lib/                   # Utilities and helpers
```

## Coding Guidelines
- Use TypeScript for all new files
- Follow Next.js App Router conventions
- Keep components small and focused
- Use server components by default, client components only when needed
- Implement responsive design for all pages

## Key Entities
- **User**: Learners who take courses
- **Course**: Collection of modules/lessons on a topic
- **Module**: Group of related lessons within a course
- **Lesson**: Individual learning unit (video, text, or interactive)
- **Progress**: Tracks user completion status

## Database Architecture (Supabase/PostgreSQL)

### Tables

#### `public.users`
User profiles linked to Supabase Auth.
| Column | Type | Description |
|--------|------|-------------|
| id | UUID (PK, FK → auth.users) | User ID from Supabase Auth |
| email | TEXT | User's email |
| created_at | TIMESTAMPTZ | Account creation time |

**Trigger**: `on_auth_user_created` - Auto-creates row on signup.

#### `public.courses`
Course identifiers for access control.
| Column | Type | Description |
|--------|------|-------------|
| id | UUID (PK) | Course identifier |
| slug | TEXT (UNIQUE) | Course key (e.g., 'nextjs-fundamentals') |
| stripe_price_id | TEXT | Stripe Price ID for checkout |
| created_at | TIMESTAMPTZ | Creation timestamp |

#### `public.user_courses`
Tracks which users have access to which courses.
| Column | Type | Description |
|--------|------|-------------|
| user_id | UUID (FK → users) | The user |
| course_id | UUID (FK → courses) | The course |
| purchased_at | TIMESTAMPTZ | When access was granted |

**Primary key**: (user_id, course_id)

#### `public.payment_transactions`
Stripe payment records.
| Column | Type | Description |
|--------|------|-------------|
| id | UUID (PK) | Transaction identifier |
| user_id | UUID (FK → users) | User who paid |
| course_id | UUID (FK → courses) | Course purchased |
| stripe_payment_intent_id | TEXT (UNIQUE) | Stripe PaymentIntent ID |
| amount_cents | INTEGER | Amount in cents |
| status | TEXT | succeeded, failed, refunded |
| created_at | TIMESTAMPTZ | Transaction timestamp |

### Entity Relationships
```
auth.users → users → user_courses ← courses
                ↓
        payment_transactions
```
