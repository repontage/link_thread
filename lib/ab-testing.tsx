"use client";
/* eslint-disable no-unused-vars */

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type TestVariant = "control" | "variant_a" | "variant_b";

export interface ABTest {
  id: string;
  name: string;
  description: string;
  variants: TestVariant[];
  weights: number[]; // e.g., [0.5, 0.25, 0.25] for control, a, b
}

export interface ABTestAssignment {
  testId: string;
  variant: TestVariant;
}

// Active A/B tests configuration
const ACTIVE_TESTS: ABTest[] = [
  {
    id: "hero-layout-v1",
    name: "Hero Section Layout",
    description: "Testing different hero section arrangements for conversion",
    variants: ["control", "variant_a", "variant_b"],
    weights: [0.5, 0.25, 0.25],
  },
  {
    id: "cta-color-v1",
    name: "CTA Button Color",
    description: "Testing CTA button color for click-through rate",
    variants: ["control", "variant_a"],
    weights: [0.5, 0.5],
  },
];

interface ABTestContextValue {
  assignments: ABTestAssignment[];
  getVariant: (testId: string) => TestVariant | null;
  getAllTests: () => ABTest[];
  trackEvent: (event: string, metadata?: Record<string, string>) => void;
}

const ABTestContext = createContext<ABTestContextValue>({
  assignments: [],
  getVariant: () => null,
  getAllTests: () => [],
  trackEvent: () => {},
});

/**
 * Deterministic assignment: uses user ID or localStorage.
 */
function assignVariants(userId?: string): ABTestAssignment[] {
  const stored = localStorage.getItem("voidsay_ab_assignments");
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      // Ignore
    }
  }

  const assignments: ABTestAssignment[] = [];
  const seed = userId || Math.random().toString(36).slice(2);

  for (const test of ACTIVE_TESTS) {
    // Deterministic hash from seed + testId
    const hash = simpleHash(seed + test.id);
    const totalWeight = test.weights.reduce((a, b) => a + b, 0);
    const normalizedHash = (hash % 10000) / 10000; // 0.0 - 1.0

    let cumulative = 0;
    let assigned: TestVariant = test.variants[0];
    for (let i = 0; i < test.variants.length; i++) {
      cumulative += test.weights[i] / totalWeight;
      if (normalizedHash <= cumulative) {
        assigned = test.variants[i];
        break;
      }
    }

    assignments.push({ testId: test.id, variant: assigned });
  }

  // Persist for session consistency
  localStorage.setItem("voidsay_ab_assignments", JSON.stringify(assignments));
  return assignments;
}

function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

export function ABTestProvider({
  children,
  userId,
}: {
  children: ReactNode;
  userId?: string;
}) {
  const [assignments, setAssignments] = useState<ABTestAssignment[]>([]);

  useEffect(() => {
    setAssignments(assignVariants(userId));
  }, [userId]);

  const getVariant = (testId: string): TestVariant | null => {
    return assignments.find((a) => a.testId === testId)?.variant || null;
  };

  const getAllTests = (): ABTest[] => ACTIVE_TESTS;

  const trackEvent = (event: string, metadata?: Record<string, string>) => {
    // In production, send to analytics endpoint
    const payload = {
      event,
      assignments,
      metadata,
      timestamp: new Date().toISOString(),
    };
    // Fire-and-forget analytics event
    if (process.env.NODE_ENV !== "test") {
      fetch("/api/admin/analytics/event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }).catch(() => {
        // Silent fail
      });
    }
    if (process.env.NODE_ENV === "development") {
      console.log("[AB Test Event]", payload);
    }
  };

  return (
    <ABTestContext.Provider value={{ assignments, getVariant, getAllTests, trackEvent }}>
      {children}
    </ABTestContext.Provider>
  );
}

export function useABTest() {
  return useContext(ABTestContext);
}
