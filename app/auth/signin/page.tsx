'use client';

import { Suspense, useState, useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Shield, AlertCircle } from 'lucide-react';

const MIN_AGES: Record<string, number> = {
  KR: 14,
  default: 13,
};

function SignInContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const callbackUrl = searchParams.get('callbackUrl') || '/';
  const error = searchParams.get('error');

  const [step, setStep] = useState<'age-gate' | 'providers'>('age-gate');
  const [birthYear, setBirthYear] = useState('');
  const [birthMonth, setBirthMonth] = useState('');
  const [birthDay, setBirthDay] = useState('');
  const [ageError, setAgeError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (session) {
      router.replace(callbackUrl);
    }
  }, [session, router, callbackUrl]);

  const currentYear = new Date().getFullYear();

  const handleAgeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAgeError('');

    const year = parseInt(birthYear);
    const month = parseInt(birthMonth);
    const day = parseInt(birthDay);

    if (!year || !month || !day || year < 1900 || year > currentYear || month < 1 || month > 12 || day < 1 || day > 31) {
      setAgeError('Please enter a valid date of birth.');
      return;
    }

    const birthDate = new Date(year, month - 1, day);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    const minAge = MIN_AGES['KR'] || MIN_AGES['default'];

    if (age < minAge) {
      setAgeError(
        `You must be at least ${minAge} years old to use this Service. In some EU countries, the minimum age may be up to 16. Please review our Terms of Service and Privacy Policy for details.`
      );
      return;
    }

    sessionStorage.setItem('voidsay-age-verified', 'true');
    sessionStorage.setItem('voidsay-birth-year', String(year));
    setStep('providers');
  };

  const handleSignIn = async (provider: string) => {
    setLoading(true);
    await signIn(provider, { callbackUrl });
  };

  if (session) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-zinc-950 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome to VoidSay</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Universal Commenting, Privacy-First</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700 dark:text-red-300">
              {error === 'OAuthSignin' && 'There was a problem initiating the sign-in. Please try again.'}
              {error === 'OAuthCallback' && 'There was a problem completing the sign-in. Please try again.'}
              {error === 'OAuthAccountNotLinked' && 'This account is already linked to another sign-in method.'}
              {!['OAuthSignin', 'OAuthCallback', 'OAuthAccountNotLinked'].includes(error) && `Sign-in error: ${error}`}
            </p>
          </div>
        )}

        {step === 'age-gate' ? (
          <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                <Shield className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <h2 className="font-semibold text-gray-900 dark:text-white">Age Verification</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">Required by law (GDPR, COPPA, AADC)</p>
              </div>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Please enter your date of birth. You must be at least 13 years old (14 in Korea,
              up to 16 in some EU countries) to use VoidSay. This information is only used for
              age verification and is not stored on our servers.
            </p>

            <form onSubmit={handleAgeSubmit} className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Year</label>
                  <input
                    type="number"
                    placeholder="YYYY"
                    value={birthYear}
                    onChange={(e) => setBirthYear(e.target.value)}
                    maxLength={4}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Month</label>
                  <input
                    type="number"
                    placeholder="MM"
                    value={birthMonth}
                    onChange={(e) => setBirthMonth(e.target.value)}
                    min={1}
                    max={12}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Day</label>
                  <input
                    type="number"
                    placeholder="DD"
                    value={birthDay}
                    onChange={(e) => setBirthDay(e.target.value)}
                    min={1}
                    max={31}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              {ageError && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-red-500 dark:text-red-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700 dark:text-red-300">{ageError}</p>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-medium rounded-lg transition-colors text-sm"
              >
                Continue
              </button>

              <p className="text-xs text-gray-400 dark:text-gray-500 text-center">
                By proceeding, you agree to our{' '}
                <a href="/terms" className="text-blue-500 hover:underline">Terms of Service</a>
                {' '}and{' '}
                <a href="/privacy" className="text-blue-500 hover:underline">Privacy Policy</a>.
              </p>
            </form>
          </div>
        ) : (
          <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-xl p-6 shadow-sm">
            <h2 className="font-semibold text-gray-900 dark:text-white mb-4 text-center">Sign in with</h2>

            <div className="space-y-3">
              <button
                onClick={() => handleSignIn('google')}
                disabled={loading}
                className="w-full py-2.5 px-4 border border-gray-300 dark:border-zinc-600 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors flex items-center justify-center gap-3 text-sm font-medium text-gray-700 dark:text-gray-300 disabled:opacity-50"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </button>

              <button
                onClick={() => handleSignIn('github')}
                disabled={loading}
                className="w-full py-2.5 px-4 border border-gray-300 dark:border-zinc-600 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors flex items-center justify-center gap-3 text-sm font-medium text-gray-700 dark:text-gray-300 disabled:opacity-50"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                Continue with GitHub
              </button>

              <button
                onClick={() => handleSignIn('passkey')}
                disabled={loading}
                className="w-full py-2.5 px-4 border border-gray-300 dark:border-zinc-600 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors flex items-center justify-center gap-3 text-sm font-medium text-gray-700 dark:text-gray-300 disabled:opacity-50"
              >
                <Shield className="w-5 h-5" />
                Continue with Passkey
              </button>
            </div>

            <div className="mt-4 flex items-center gap-2">
              <button
                onClick={() => { setStep('age-gate'); setAgeError(''); }}
                className="text-xs text-blue-500 hover:underline"
              >
                ← Back
              </button>
              <span className="text-xs text-gray-400">Age verified: born {birthYear}</span>
            </div>
          </div>
        )}

        <p className="text-xs text-gray-400 dark:text-gray-500 text-center mt-6">
          By signing in, you agree to our{' '}
          <a href="/terms" className="hover:underline">Terms</a> and{' '}
          <a href="/privacy" className="hover:underline">Privacy Policy</a>.
        </p>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-gray-400">Loading...</div>
      </div>
    }>
      <SignInContent />
    </Suspense>
  );
}
