'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function ResetPasswordPage() {
  const router = useRouter();
  const supabase = createClient();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null);

  // Password requirements
  const passwordRequirements = {
    minLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };

  const requirementsMet = Object.values(passwordRequirements).filter(Boolean).length;
  const allRequirementsMet = requirementsMet === 4;
  const passwordsMatch = password === confirmPassword && confirmPassword.length > 0;

  const getStrengthLabel = () => {
    if (requirementsMet === 0) return { label: '', color: '' };
    if (requirementsMet === 1) return { label: 'Weak', color: 'bg-red-500' };
    if (requirementsMet === 2) return { label: 'Fair', color: 'bg-orange-500' };
    if (requirementsMet === 3) return { label: 'Good', color: 'bg-yellow-500' };
    return { label: 'Strong', color: 'bg-green-500' };
  };

  const strength = getStrengthLabel();

  // Check if user has a valid session from the reset link
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setMessage({
          type: 'error',
          text: 'Invalid or expired reset link. Please request a new one.',
        });
      }
    };
    checkSession();
  }, [supabase.auth]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match.' });
      return;
    }

    if (!allRequirementsMet) {
      setMessage({ type: 'error', text: 'Please meet all password requirements.' });
      return;
    }

    setLoading(true);
    setMessage(null);

    const { error } = await supabase.auth.updateUser({
      password: password,
    });

    if (error) {
      setMessage({ type: 'error', text: error.message });
      setLoading(false);
      return;
    }

    setMessage({
      type: 'success',
      text: 'Password updated successfully! Redirecting...',
    });

    setTimeout(() => {
      router.push('/dashboard');
    }, 2000);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#030014]">
      {/* Animated grid background */}
      <div className="tech-grid absolute inset-0" />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#030014]/50 to-[#030014]" />

      {/* Glowing orbs */}
      <div
        className="glow-orb"
        style={{
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.3) 0%, transparent 70%)',
          top: '-100px',
          right: '-100px',
        }}
      />
      <div
        className="glow-orb"
        style={{
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(0, 240, 255, 0.2) 0%, transparent 70%)',
          bottom: '-100px',
          left: '-100px',
          animationDelay: '2s',
        }}
      />

      {/* Main content */}
      <main className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 py-12">
        {/* Logo */}
        <Link href="/" className="mb-8 flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-purple-600">
            <span className="text-lg font-bold text-white">T</span>
          </div>
          <span className="text-2xl font-bold text-white">TechLearn</span>
        </Link>

        {/* Card */}
        <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900/50 p-8 backdrop-blur-sm">
          {/* Header */}
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold text-white">Set new password</h1>
            <p className="mt-2 text-sm text-zinc-400">
              Enter your new password below
            </p>
          </div>

          {/* Message */}
          {message && (
            <div
              className={`mb-4 rounded-lg p-3 text-sm ${
                message.type === 'error'
                  ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                  : 'bg-green-500/10 text-green-400 border border-green-500/20'
              }`}
            >
              {message.text}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="password" className="mb-2 block text-sm font-medium text-zinc-300">
                New Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setPasswordTouched(true);
                }}
                className={`w-full rounded-lg border bg-zinc-800/50 px-4 py-3 text-white placeholder-zinc-500 transition-colors focus:outline-none focus:ring-1 ${
                  passwordTouched && !allRequirementsMet && password.length > 0
                    ? 'border-orange-500 focus:border-orange-500 focus:ring-orange-500'
                    : passwordTouched && allRequirementsMet
                    ? 'border-green-500 focus:border-green-500 focus:ring-green-500'
                    : 'border-zinc-700 focus:border-cyan-500 focus:ring-cyan-500'
                }`}
                placeholder="Enter new password"
                required
                disabled={loading}
              />

              {/* Password Strength Meter */}
              {passwordTouched && password.length > 0 && (
                <div className="mt-3">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-xs text-zinc-500">Password strength</span>
                    <span className={`text-xs font-medium ${
                      requirementsMet === 1 ? 'text-red-400' :
                      requirementsMet === 2 ? 'text-orange-400' :
                      requirementsMet === 3 ? 'text-yellow-400' :
                      requirementsMet === 4 ? 'text-green-400' : 'text-zinc-500'
                    }`}>
                      {strength.label}
                    </span>
                  </div>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map((level) => (
                      <div
                        key={level}
                        className={`h-1.5 flex-1 rounded-full transition-colors ${
                          level <= requirementsMet ? strength.color : 'bg-zinc-700'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Password Requirements */}
              {passwordTouched && (
                <div className="mt-4 space-y-2">
                  <p className="text-xs font-medium text-zinc-400">Password must contain:</p>
                  <ul className="space-y-1.5">
                    <li className={`flex items-center gap-2 text-xs ${passwordRequirements.minLength ? 'text-green-400' : 'text-zinc-500'}`}>
                      {passwordRequirements.minLength ? (
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      )}
                      At least 8 characters
                    </li>
                    <li className={`flex items-center gap-2 text-xs ${passwordRequirements.hasUppercase ? 'text-green-400' : 'text-zinc-500'}`}>
                      {passwordRequirements.hasUppercase ? (
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      )}
                      One uppercase letter
                    </li>
                    <li className={`flex items-center gap-2 text-xs ${passwordRequirements.hasNumber ? 'text-green-400' : 'text-zinc-500'}`}>
                      {passwordRequirements.hasNumber ? (
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      )}
                      One number
                    </li>
                    <li className={`flex items-center gap-2 text-xs ${passwordRequirements.hasSpecial ? 'text-green-400' : 'text-zinc-500'}`}>
                      {passwordRequirements.hasSpecial ? (
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      )}
                      One special character (!@#$%^&*)
                    </li>
                  </ul>
                </div>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="mb-2 block text-sm font-medium text-zinc-300">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`w-full rounded-lg border bg-zinc-800/50 px-4 py-3 text-white placeholder-zinc-500 transition-colors focus:outline-none focus:ring-1 ${
                  confirmPassword.length > 0 && !passwordsMatch
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                    : confirmPassword.length > 0 && passwordsMatch
                    ? 'border-green-500 focus:border-green-500 focus:ring-green-500'
                    : 'border-zinc-700 focus:border-cyan-500 focus:ring-cyan-500'
                }`}
                placeholder="Confirm new password"
                required
                disabled={loading}
              />
              {confirmPassword.length > 0 && !passwordsMatch && (
                <p className="mt-2 flex items-center gap-1 text-sm text-red-400">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Passwords do not match
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || !allRequirementsMet || !passwordsMatch}
              className="mt-2 w-full rounded-lg bg-gradient-to-r from-cyan-500 to-purple-600 py-3 text-sm font-semibold text-white transition-all hover:opacity-90 hover:shadow-lg hover:shadow-cyan-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Updating...
                </span>
              ) : (
                'Update password'
              )}
            </button>
          </form>
        </div>

        {/* Back to home */}
        <Link
          href="/"
          className="mt-8 flex items-center gap-2 text-sm text-zinc-500 transition-colors hover:text-zinc-300"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to home
        </Link>
      </main>
    </div>
  );
}
