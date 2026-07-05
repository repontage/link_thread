'use client';

import React, { useState, useEffect } from 'react';
import { X, Cookie, Shield, BarChart3, Settings } from 'lucide-react';

interface CookiePreferences {
  essential: boolean;
  analytics: boolean;
  functional: boolean;
}

const STORAGE_KEY = 'voidsay-cookie-preferences';
const CONSENT_VERSION = 1;

function getStoredPreferences(): CookiePreferences | null {
  if (typeof window === 'undefined') return null;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    const parsed = JSON.parse(stored);
    if (parsed?.version === CONSENT_VERSION) {
      return parsed.preferences;
    }
    return null;
  } catch {
    return null;
  }
}

function storePreferences(prefs: CookiePreferences) {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ version: CONSENT_VERSION, preferences: prefs, timestamp: Date.now() })
    );
  } catch {
    // Ignore localStorage errors (private browsing, etc.)
  }
}

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [showCustomize, setShowCustomize] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    essential: true,
    analytics: false,
    functional: false,
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = getStoredPreferences();
    if (!stored) {
      // Show banner after a short delay to avoid flash on page load
      const timer = setTimeout(() => setVisible(true), 800);
      return () => clearTimeout(timer);
    }
  }, []);

  const acceptAll = () => {
    const allAccepted: CookiePreferences = { essential: true, analytics: true, functional: true };
    storePreferences(allAccepted);
    setVisible(false);
    applyPreferences(allAccepted);
  };

  const acceptEssential = () => {
    const essentialOnly: CookiePreferences = { essential: true, analytics: false, functional: false };
    storePreferences(essentialOnly);
    setVisible(false);
    applyPreferences(essentialOnly);
  };

  const saveCustom = () => {
    storePreferences(preferences);
    setVisible(false);
    setShowCustomize(false);
    applyPreferences(preferences);
  };

  const applyPreferences = (prefs: CookiePreferences) => {
    // Analytics consent - load Vercel Analytics only if accepted
    if (prefs.analytics && typeof window !== 'undefined') {
      (window as any).__va = (window as any).__va || function () {
        ((window as any).__vaq = (window as any).__vaq || []).push(arguments);
      };
      // Allow analytics cookies
      document.cookie = 'voidsay_analytics_consent=true; path=/; max-age=31536000; SameSite=Lax';
    } else {
      // Revoke analytics consent
      document.cookie = 'voidsay_analytics_consent=false; path=/; max-age=31536000; SameSite=Lax';
    }
  };

  if (!mounted || !visible) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/40 z-[9998]" onClick={acceptEssential} />

      {/* Banner */}
      <div className="fixed bottom-0 left-0 right-0 z-[9999] animate-slide-up p-4 sm:p-6">
        <div className="max-w-2xl mx-auto bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-2xl shadow-2xl overflow-hidden">
          {!showCustomize ? (
            /* Simple View */
            <div className="p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <Cookie className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white text-lg mb-1">
                    Cookie Consent
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    We use cookies to enhance your browsing experience, analyze site traffic, and provide
                    functional features. Essential cookies are always enabled. By clicking &ldquo;Accept All,&rdquo;
                    you consent to our use of analytics and functional cookies. You can customize your
                    preferences or review our{' '}
                    <a href="/privacy" className="text-blue-600 dark:text-blue-400 hover:underline">
                      Privacy Policy
                    </a>
                    .
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
                <button
                  onClick={() => setShowCustomize(true)}
                  className="px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition-colors order-3 sm:order-1"
                >
                  <Settings className="w-4 h-4 inline mr-1.5" />
                  Customize
                </button>
                <button
                  onClick={acceptEssential}
                  className="px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-zinc-600 hover:bg-gray-50 dark:hover:bg-zinc-800 rounded-lg transition-colors order-2"
                >
                  <Shield className="w-4 h-4 inline mr-1.5" />
                  Essential Only
                </button>
                <button
                  onClick={acceptAll}
                  className="px-4 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 rounded-lg transition-colors order-1 sm:order-3"
                >
                  Accept All
                </button>
              </div>
            </div>
          ) : (
            /* Customize View */
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
                  Cookie Preferences
                </h3>
                <button
                  onClick={() => setShowCustomize(false)}
                  className="p-1.5 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
                  aria-label="Close customize"
                >
                  <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                </button>
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                Manage your cookie preferences below. Essential cookies cannot be disabled as they are
                required for the Service to function properly.
              </p>

              {/* Essential - always on */}
              <div className="flex items-start gap-3 py-3 border-t border-gray-200 dark:border-zinc-700">
                <Shield className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900 dark:text-white text-sm">Essential</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                      Always Active
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Required for authentication, session management, and security. These cannot be disabled.
                  </p>
                </div>
              </div>

              {/* Analytics */}
              <div className="flex items-start gap-3 py-3 border-t border-gray-200 dark:border-zinc-700">
                <BarChart3 className="w-5 h-5 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900 dark:text-white text-sm">Analytics</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={preferences.analytics}
                        onChange={(e) =>
                          setPreferences({ ...preferences, analytics: e.target.checked })
                        }
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-zinc-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-zinc-600 peer-checked:bg-blue-600" />
                    </label>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Help us understand how visitors interact with VoidSay. Uses Vercel Analytics.
                    No personal data is shared with third parties.
                  </p>
                </div>
              </div>

              {/* Functional */}
              <div className="flex items-start gap-3 py-3 border-t border-b border-gray-200 dark:border-zinc-700">
                <Settings className="w-5 h-5 text-orange-600 dark:text-orange-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900 dark:text-white text-sm">Functional</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={preferences.functional}
                        onChange={(e) =>
                          setPreferences({ ...preferences, functional: e.target.checked })
                        }
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-zinc-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-zinc-600 peer-checked:bg-blue-600" />
                    </label>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Enable enhanced features like theme persistence, language preferences, and
                    embedded content from third-party platforms (YouTube, X/Twitter).
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:justify-end mt-4">
                <button
                  onClick={acceptEssential}
                  className="px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-zinc-600 hover:bg-gray-50 dark:hover:bg-zinc-800 rounded-lg transition-colors"
                >
                  Essential Only
                </button>
                <button
                  onClick={saveCustom}
                  className="px-4 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 rounded-lg transition-colors"
                >
                  Save Preferences
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Animation styles */}
      <style jsx>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-slide-up {
          animation: slide-up 0.4s ease-out;
        }
      `}</style>
    </>
  );
}
