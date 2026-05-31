/**
 * Multi-layer Toxicity Detection System
 *
 * This module extends the basic keyword filter (`lib/filter.ts`) with:
 * - Expanded multilingual keyword lists (English, Korean, Japanese)
 * - Advanced pattern matching (URL spam, repeated caps, excessive punctuation)
 * - Score-based classification (mild vs severe flagging)
 */

export interface ToxicityResult {
  isToxic: boolean;
  score: number; // 0.0 - 1.0
  reasons: string[];
  severity: "none" | "mild" | "severe";
}

// English toxic keywords (expanded)
const EN_TOXIC: string[] = [
  "fuck", "fucking", "fucker", "shit", "shitting", "bitch", "bastard",
  "asshole", "dick", "piss", "cunt", "faggot", "nigger", "nigga",
  "motherfucker", "motherfuck", "dumbass", "jackass", "douchebag",
  "slut", "whore", "porn", "porno",
];

// Korean toxic keywords (expanded)
const KR_TOXIC: string[] = [
  "씨발", "씨팔", "시발", "시팔", "존나", "좆", "지랄", "미친",
  "병신", "개새끼", "개세끼", "새끼", "멍청이", "바보", "닥쳐",
  "꺼져", "죽어", "뒤져", "엿", "호로", "걸레", "창녀",
];

// Japanese toxic keywords
const JP_TOXIC: string[] = [
  "ばか", "バカ", "あほ", "アホ", "くそ", "クソ", "死ね", "しね",
  "殺す", "ころす", "うざい", "きもい", "変態", "へんたい",
];

// Spam patterns
const SPAM_PATTERNS = [
  /https?:\/\/[^\s]{30,}/g,          // Very long URLs
  /(buy|click|subscribe|follow)\s*(now|here|me)/gi, // Spammy phrases
  /\b(bit\.ly|tinyurl|shorturl)\/[a-zA-Z0-9]+\b/gi, // Short URLs (potential spam)
];

/**
 * Evaluates content and returns a toxicity classification with score.
 */
export function analyzeToxicity(content: string): ToxicityResult {
  if (!content || content.trim().length === 0) {
    return { isToxic: false, score: 0, reasons: [], severity: "none" };
  }

  const lower = content.toLowerCase();
  const reasons: string[] = [];
  let score = 0;

  // 1. Check keyword lists
  const words = lower.split(/[\s,.!?;:()]+/).filter(Boolean);

  for (const word of words) {
    if (EN_TOXIC.indexOf(word) !== -1) {
      score += 0.3;
      if (reasons.indexOf("Profanity detected") === -1) {
        reasons.push("Profanity detected");
      }
    }
    if (KR_TOXIC.indexOf(word) !== -1) {
      score += 0.3;
      if (reasons.indexOf("한국어 욕설 감지") === -1) {
        reasons.push("한국어 욕설 감지");
      }
    }
    if (JP_TOXIC.indexOf(word) !== -1) {
      score += 0.3;
      if (reasons.indexOf("Japanese profanity detected") === -1) {
        reasons.push("Japanese profanity detected");
      }
    }
  }

  // 2. Check for SUBSTRING match in Korean (handles compound words)
  if (/[가-힣]/.test(content)) {
    for (const kw of KR_TOXIC) {
      if (content.indexOf(kw) !== -1) {
        score += 0.25;
        if (reasons.indexOf("한국어 욕설 감지") === -1) {
          reasons.push("한국어 욕설 감지");
        }
        break;
      }
    }
  }

  // 3. Check spam patterns
  for (const pattern of SPAM_PATTERNS) {
    const matches = content.match(pattern);
    if (matches && matches.length > 0) {
      score += 0.2 * matches.length;
      if (reasons.indexOf("Spam pattern detected") === -1) {
        reasons.push("Spam pattern detected");
      }
    }
  }

  // 4. Excessive ALL CAPS (more than 60% of alphabetic chars)
  const alphaChars = content.replace(/[^a-zA-Z가-힣]/g, "");
  const upperAlpha = content.replace(/[^A-Z]/g, "");
  if (alphaChars.length > 10 && upperAlpha.length / alphaChars.length > 0.6) {
    score += 0.15;
    if (reasons.indexOf("Excessive capitalization") === -1) {
      reasons.push("Excessive capitalization");
    }
  }

  // 5. Repeated characters (potential spam/shouting)
  const repeatPattern = /(.)\1{4,}/g;
  const repeatMatches = content.match(repeatPattern);
  if (repeatMatches) {
    score += 0.1 * Math.min(repeatMatches.length, 3);
    if (reasons.indexOf("Repeated characters") === -1) {
      reasons.push("Repeated characters");
    }
  }

  // 6. Harassment patterns (direct insults like "you are a")
  const harassmentPatterns = [
    /\byou\s+(are|r)\s+(a|an|so|such\s+a)\s+(fuck|shit|bitch|dick|ass)/i,
    /\b너\s*(는|가|ㄴ)\s*(진짜|완전|존나)\s*(병신|씨발|개새끼)/,
  ];
  for (const pattern of harassmentPatterns) {
    if (pattern.test(content)) {
      score += 0.4;
      if (reasons.indexOf("Harassment detected") === -1) {
        reasons.push("Harassment detected");
      }
      break;
    }
  }

  // Clamp score
  score = Math.min(score, 1.0);

  // Determine severity
  let severity: ToxicityResult["severity"] = "none";
  if (score >= 0.5) severity = "severe";
  else if (score >= 0.2) severity = "mild";

  return {
    isToxic: score >= 0.2,
    score,
    reasons,
    severity,
  };
}

/**
 * Returns a human-readable suggestion for moderation action.
 */
export function getModerationAction(result: ToxicityResult): string {
  if (result.severity === "severe") {
    return "Flag for admin review and automatically hide from public view";
  }
  if (result.severity === "mild") {
    return "Flag for admin review but keep visible";
  }
  return "No action needed";
}
