import { useState, useCallback } from 'react';

export interface UserProfile {
  name: string | null;
  age: number | null;
  jurisdiction: string | null;
  currency: string | null;
  incomeRange: string | null;
  goals: string[];
  experienceLevel: string | null;
  archetype: string | null;
  lessonsCompleted: string[];
  currentTopic: string | null;
  quizScores: number[];
  streak: number;
  lastVisit: string | null;
  onboarded: boolean;
}

const EMPTY_PROFILE: UserProfile = {
  name: null,
  age: null,
  jurisdiction: null,
  currency: null,
  incomeRange: null,
  goals: [],
  experienceLevel: null,
  archetype: null,
  lessonsCompleted: [],
  currentTopic: null,
  quizScores: [],
  streak: 0,
  lastVisit: null,
  onboarded: false,
};

export function useProfile() {
  const [profile, setProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('penny_profile');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Update streak
        const today = new Date().toDateString();
        const yesterday = new Date(Date.now() - 86400000).toDateString();
        if (parsed.lastVisit === today) {
          return { ...EMPTY_PROFILE, ...parsed };
        } else if (parsed.lastVisit === yesterday) {
          const updated = { ...EMPTY_PROFILE, ...parsed, streak: (parsed.streak || 0) + 1, lastVisit: today };
          localStorage.setItem('penny_profile', JSON.stringify(updated));
          return updated;
        } else {
          const updated = { ...EMPTY_PROFILE, ...parsed, streak: 1, lastVisit: today };
          localStorage.setItem('penny_profile', JSON.stringify(updated));
          return updated;
        }
      }
      const fresh = { ...EMPTY_PROFILE, streak: 1, lastVisit: new Date().toDateString() };
      localStorage.setItem('penny_profile', JSON.stringify(fresh));
      return fresh;
    } catch {
      return { ...EMPTY_PROFILE };
    }
  });

  const update = useCallback((patch: Partial<UserProfile>) => {
    setProfile(prev => {
      const next = { ...prev, ...patch };
      try { localStorage.setItem('penny_profile', JSON.stringify(next)); } catch {}
      return next;
    });
  }, []);

  const clear = useCallback(() => {
    const fresh = { ...EMPTY_PROFILE, streak: 1, lastVisit: new Date().toDateString() };
    setProfile(fresh);
    try { localStorage.setItem('penny_profile', JSON.stringify(fresh)); } catch {}
  }, []);

  return [profile, update, clear] as const;
}

// Detect profile hints from conversation text
export function extractProfileHints(aiText: string, userText: string): Partial<UserProfile> {
  const hints: Partial<UserProfile> = {};
  const combined = (userText + ' ' + aiText).toLowerCase();

  // Jurisdiction
  if (/\b(epf|kwsp|socso|lhdn|asb|ptptn|ringgit|\brm\s?\d)/i.test(combined)) {
    hints.jurisdiction = 'MY'; hints.currency = 'RM';
  } else if (/\b(401k|ira|social security|w-?2|us\s?dollar)/i.test(combined)) {
    hints.jurisdiction = 'US'; hints.currency = '$';
  } else if (/\b(cpf|medisave|s\$|sgd)/i.test(combined)) {
    hints.jurisdiction = 'SG'; hints.currency = 'S$';
  } else if (/\b(isa|hmrc|£|gbp|pension\s?pot)/i.test(combined)) {
    hints.jurisdiction = 'UK'; hints.currency = '£';
  }

  // Goals
  const goalPatterns = [
    { re: /\b(save|saving|house|home|property|down\s?payment)\b/i, goal: 'property' },
    { re: /\b(retire|retirement|pension|epf)\b/i, goal: 'retirement' },
    { re: /\b(debt|loan|pay\s?off|credit\s?card|ptptn)\b/i, goal: 'debt-free' },
    { re: /\b(invest|stocks?|etf|fund|crypto)\b/i, goal: 'investing' },
    { re: /\b(budget|spending|overspend|emergency)\b/i, goal: 'budgeting' },
    { re: /\b(travel|trip|vacation|holiday)\b/i, goal: 'travel' },
  ];
  const detected = goalPatterns.filter(p => p.re.test(combined)).map(p => p.goal);
  if (detected.length > 0) hints.goals = detected;

  // Experience level
  if (/\b(beginner|new to|don'?t know|no idea|first time|just starting)\b/i.test(combined)) {
    hints.experienceLevel = 'beginner';
  } else if (/\b(advanced|experienced|portfolio|rebalanc|dividend)\b/i.test(combined)) {
    hints.experienceLevel = 'advanced';
  }

  // Archetype detection
  if (/\b(scared|anxious|worried|stressed|overwhelm|no idea|lost)\b/i.test(combined)) {
    hints.archetype = 'anxious-beginner';
  } else if (/\b(debt|owe|loan|ptptn|credit card|drowning)\b/i.test(combined)) {
    hints.archetype = 'debt-fighter';
  } else if (/\b(house|retire|wedding|car|goal|target|save for)\b/i.test(combined)) {
    hints.archetype = 'goal-chaser';
  } else if (/\b(stock|crypto|market|invest|etf|trade|buy)\b/i.test(combined)) {
    hints.archetype = 'market-watcher';
  } else if (/\b(learn|understand|curious|how does|what is|explain)\b/i.test(combined)) {
    hints.archetype = 'curious-explorer';
  }

  return hints;
}
