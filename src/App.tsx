import React, { useState, useEffect, useRef, useCallback } from 'react';
import { PennyFace, PennyMini } from './components/PennyMascot';
import { useProfile, extractProfileHints } from './lib/profile';
import { useChatHistory, type ChatMessage } from './lib/chat';
import { buildSystemPrompt } from './lib/prompts';
import { generateFollowUps, getProgress, getPathForUser } from './lib/guides';

// ─── Markdown renderer ────────────────────────────────────────
function renderMd(s: string): string {
  return s
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/`(.+?)`/g, '<code>$1</code>')
    .replace(/\n/g, '<br/>');
}

// ─── Daily tips ───────────────────────────────────────────────
const DAILY_TIPS = [
  "The 50/30/20 rule: 50% needs, 30% wants, 20% savings. Simple starting point.",
  "Compound interest is most powerful when you start early — even small amounts matter.",
  "An emergency fund of 3-6 months' expenses is your financial safety net.",
  "Paying off high-interest debt first (avalanche method) saves the most money long-term.",
  "Your EPF/CPF/401k employer match is free money — always take the full match.",
  "Inflation means your savings lose value sitting in a regular account. Consider alternatives.",
  "The best investment strategy is the one you'll actually stick with consistently.",
];

// ─── Conversation starters ───────────────────────────────────
const STARTERS = [
  { icon: '💰', text: "I want to start saving but don't know how", tone: 'peach' as const },
  { icon: '📊', text: "Help me understand investing", tone: 'lav' as const },
  { icon: '🏠', text: "I'm saving for a house", tone: 'mint' as const },
  { icon: '💸', text: "I think I'm spending too much", tone: 'pink' as const },
];

const TONE_COLORS: Record<string, { bg: string; border: string }> = {
  peach: { bg: '#FFE8DF', border: '#FFD4C8' },
  lav:   { bg: '#ECE6FF', border: '#D8CEFF' },
  mint:  { bg: '#E3F5EC', border: '#C8EBDA' },
  pink:  { bg: '#FCE0EE', border: '#F5C8DE' },
};

// ─── Message component ───────────────────────────────────────
function Message({ msg, isFirstInGroup }: { msg: ChatMessage | { role: 'typing'; id: string; text?: string }; isFirstInGroup: boolean }) {
  if (msg.role === 'user') {
    return (
      <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '2px 16px', animation: 'slideUp 0.25s ease' }}>
        <div style={{
          maxWidth: '80%', padding: '12px 16px',
          background: '#FFE8DF', color: '#3D2E24',
          borderRadius: '18px 18px 4px 18px',
          fontSize: 14.5, lineHeight: 1.5,
        }}>
          {msg.text}
        </div>
      </div>
    );
  }

  if (msg.role === 'typing') {
    return (
      <div style={{ display: 'flex', gap: 8, padding: '2px 16px', alignItems: 'flex-end' }}>
        <PennyMini size={30} />
        <div style={{
          padding: '14px 18px', background: 'white',
          borderRadius: '18px 18px 18px 4px',
          boxShadow: '0 1px 3px rgba(92,74,61,0.06)',
        }}>
          <div style={{ display: 'flex', gap: 5 }}>
            {[0,1,2].map(i => (
              <div key={i} style={{
                width: 7, height: 7, borderRadius: '50%', background: '#D4C4B8',
                animation: `bounce 1.2s ease-in-out ${i * 0.15}s infinite`,
              }} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', gap: 8, padding: '2px 16px', alignItems: 'flex-start', animation: 'slideUp 0.3s ease' }}>
      <div style={{ width: 30, flexShrink: 0 }}>
        {isFirstInGroup && <PennyMini size={30} />}
      </div>
      <div style={{
        maxWidth: '82%', padding: '12px 16px',
        background: 'white', color: '#3D2E24',
        borderRadius: '18px 18px 18px 4px',
        fontSize: 14.5, lineHeight: 1.6,
        boxShadow: '0 1px 3px rgba(92,74,61,0.06)',
      }}>
        <span dangerouslySetInnerHTML={{ __html: renderMd(msg.text || '') }} />
      </div>
    </div>
  );
}

// ─── Follow-up chips ─────────────────────────────────────────
function FollowUpChips({ chips, onPick }: { chips: string[]; onPick: (t: string) => void }) {
  if (!chips.length) return null;
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, padding: '4px 54px 8px', animation: 'fadeIn 0.3s ease' }}>
      {chips.map((c, i) => (
        <button key={i} onClick={() => onPick(c)} style={{
          padding: '7px 14px', borderRadius: 20,
          background: 'white', border: '1px solid #E8DDD4',
          fontSize: 12.5, color: '#5C4A3D', cursor: 'pointer',
          transition: 'all 0.15s',
        }}
          onMouseEnter={e => { (e.target as HTMLElement).style.background = '#FFF5EF'; (e.target as HTMLElement).style.borderColor = '#FFB4A2'; }}
          onMouseLeave={e => { (e.target as HTMLElement).style.background = 'white'; (e.target as HTMLElement).style.borderColor = '#E8DDD4'; }}
        >
          {c}
        </button>
      ))}
    </div>
  );
}

// ─── Empty state ─────────────────────────────────────────────
function EmptyState({ onPick }: { onPick: (text: string) => void }) {
  const tipIdx = Math.floor(Date.now() / 86400000) % DAILY_TIPS.length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '48px 24px 24px', gap: 20 }}>
      <div style={{ animation: 'breathe 3s ease-in-out infinite' }}>
        <PennyFace size={100} />
      </div>
      <div style={{ textAlign: 'center', maxWidth: 300 }}>
        <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: 22, fontWeight: 500, color: '#3D2E24', margin: '0 0 6px', lineHeight: 1.2 }}>
          Hi, I'm <em style={{ fontStyle: 'italic', color: '#F08A6E' }}>Penny</em>.
        </h1>
        <p style={{ fontSize: 14, color: '#8B7868', lineHeight: 1.5, margin: 0 }}>
          Your money buddy. Tell me what's on your mind — I'm here to help you learn, not to judge.
        </p>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: '100%', maxWidth: 340 }}>
        {STARTERS.map((s, i) => {
          const t = TONE_COLORS[s.tone];
          return (
            <button key={i} onClick={() => onPick(s.text)} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '12px 16px', borderRadius: 14,
              background: t.bg, border: `1px solid ${t.border}`,
              cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s', width: '100%',
            }}>
              <span style={{ fontSize: 20, flexShrink: 0 }}>{s.icon}</span>
              <span style={{ fontSize: 13.5, color: '#3D2E24', lineHeight: 1.3 }}>{s.text}</span>
            </button>
          );
        })}
      </div>
      <div style={{
        marginTop: 8, padding: '10px 16px', borderRadius: 12,
        background: '#FFF5EF', border: '1px dashed #FFD4C8',
        maxWidth: 340, width: '100%',
      }}>
        <div style={{ fontSize: 10, fontWeight: 600, color: '#F08A6E', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 4 }}>
          Penny's tip of the day
        </div>
        <div style={{ fontSize: 12.5, color: '#5C4A3D', lineHeight: 1.4 }}>
          {DAILY_TIPS[tipIdx]}
        </div>
      </div>
      <p style={{ fontSize: 11, color: '#B8A99C', textAlign: 'center', maxWidth: 280, lineHeight: 1.4, margin: '4px 0 0' }}>
        Education, not advice. Penny is an AI — double-check anything that matters.
      </p>
    </div>
  );
}

// ─── Main App ────────────────────────────────────────────────
export function App() {
  const [profile, updateProfile, clearProfile] = useProfile();
  const { messages, append, clear: clearChat } = useChatHistory();
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [followUps, setFollowUps] = useState<string[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, isLoading]);

  useEffect(() => { inputRef.current?.focus(); }, []);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || isLoading) return;
    setFollowUps([]);

    const userMsg: ChatMessage = { role: 'user', text: text.trim(), id: Date.now().toString(), timestamp: Date.now() };
    append(userMsg);
    setInput('');
    if (inputRef.current) inputRef.current.style.height = 'auto';

    setIsLoading(true);

    try {
      const history = [...messages, userMsg].slice(-20).map(m => ({
        role: m.role === 'user' ? 'user' as const : 'assistant' as const,
        content: m.text,
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: history,
          systemPrompt: buildSystemPrompt(profile),
        }),
      });

      if (!res.ok) throw new Error(`API ${res.status}`);

      const data = await res.json();
      const aiText = data.response || data.content?.[0]?.text || "Hmm, I got a bit tongue-tied. Could you try again?";

      const aiMsg: ChatMessage = { role: 'ai', text: aiText, id: (Date.now() + 1).toString(), timestamp: Date.now() };
      append(aiMsg);

      // Silent profile extraction
      const hints = extractProfileHints(aiText, text);
      if (Object.keys(hints).length > 0) {
        const mergedGoals = hints.goals
          ? [...new Set([...(profile.goals || []), ...hints.goals])]
          : profile.goals;
        updateProfile({ ...hints, goals: mergedGoals || hints.goals });
      }

      // Check if AI confirmed a quiz answer — mark lesson complete
      const nextLesson = getPathForUser(profile)?.lessons.find(l => 
        !profile.lessonsCompleted.includes(l.id) &&
        aiText.toLowerCase().includes('correct') || aiText.toLowerCase().includes('right!')
      );
      if (nextLesson && text.toLowerCase().includes(nextLesson.quizOptions[nextLesson.quizAnswer].toLowerCase().slice(0, 10))) {
        updateProfile({
          lessonsCompleted: [...profile.lessonsCompleted, nextLesson.id],
          currentTopic: nextLesson.nextLesson,
        });
      }

      setFollowUps(generateFollowUps(aiText, profile));
    } catch (err) {
      console.error('Chat error:', err);
      const fallback: ChatMessage = {
        role: 'ai',
        text: "I'm having a little trouble connecting right now. But here's something useful: the most important step in any financial journey is just starting. Even tracking one expense today is progress. Try again in a moment?",
        id: (Date.now() + 1).toString(),
        timestamp: Date.now(),
      };
      append(fallback);
    } finally {
      setIsLoading(false);
    }
  }, [messages, profile, isLoading, append, updateProfile]);

  const isEmpty = messages.length === 0;
  const canSend = input.trim().length > 0 && !isLoading;
  const progress = getProgress(profile);
  const path = getPathForUser(profile);

  const isFirstInGroup = (idx: number) => {
    if (messages[idx].role !== 'ai') return false;
    if (idx === 0) return true;
    return messages[idx - 1].role !== 'ai';
  };

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', height: '100dvh',
      background: '#FFF8F3', maxWidth: 480, margin: '0 auto', position: 'relative',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '12px 16px', borderBottom: '1px solid #F0E1D2',
        background: 'rgba(255,248,243,0.95)', backdropFilter: 'blur(10px)',
        position: 'sticky', top: 0, zIndex: 10,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <PennyMini size={34} />
          <div>
            <div style={{ fontFamily: "'Fraunces', serif", fontSize: 16, fontWeight: 600, color: '#3D2E24' }}>Penny</div>
            <div style={{ fontSize: 11, color: '#B8A99C' }}>
              {profile.jurisdiction ? `your money buddy · ${profile.jurisdiction}` : 'your money buddy · online'}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
          {/* Streak badge */}
          {profile.streak > 1 && (
            <div style={{ padding: '4px 8px', borderRadius: 12, background: '#FFF5EF', fontSize: 11, fontWeight: 600, color: '#F5B43A' }}>
              {profile.streak}d streak
            </div>
          )}
          {/* Progress badge */}
          {path && progress.completed > 0 && (
            <div style={{ padding: '4px 8px', borderRadius: 12, background: '#E3F5EC', fontSize: 11, fontWeight: 600, color: '#4FB07F' }}>
              {progress.completed}/{progress.total}
            </div>
          )}
          {/* Jurisdiction badge */}
          {profile.jurisdiction && (
            <div style={{ padding: '4px 10px', borderRadius: 12, background: '#ECE6FF', fontSize: 10, fontWeight: 600, color: '#8B73E8' }}>
              {profile.jurisdiction}
            </div>
          )}
          {/* Reset */}
          <button
            onClick={() => { clearChat(); clearProfile(); setFollowUps([]); }}
            title="New conversation"
            style={{
              width: 34, height: 34, borderRadius: 10,
              border: '1px solid #F0E1D2', background: 'transparent',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#B8A99C', fontSize: 14,
            }}
          >
            ↻
          </button>
        </div>
      </div>

      {/* Chat area */}
      <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', WebkitOverflowScrolling: 'touch' }}>
        {isEmpty ? (
          <EmptyState onPick={(text) => sendMessage(text)} />
        ) : (
          <div style={{ padding: '12px 0 80px', display: 'flex', flexDirection: 'column', gap: 6 }}>
            {messages.map((m, i) => (
              <Message key={m.id} msg={m} isFirstInGroup={isFirstInGroup(i)} />
            ))}
            {isLoading && <Message msg={{ role: 'typing', id: 't' }} isFirstInGroup={true} />}
            {!isLoading && <FollowUpChips chips={followUps} onPick={(t) => sendMessage(t)} />}
          </div>
        )}
      </div>

      {/* Composer */}
      <div style={{
        display: 'flex', alignItems: 'flex-end', gap: 8,
        padding: '10px 12px', borderTop: '1px solid #F0E1D2',
        background: 'rgba(255,248,243,0.95)', backdropFilter: 'blur(10px)',
      }}>
        <div style={{
          flex: 1, display: 'flex', alignItems: 'flex-end',
          background: 'white', borderRadius: 22,
          border: '1px solid #E8DDD4', padding: '4px 4px 4px 16px',
        }}>
          <textarea
            ref={inputRef}
            value={input}
            placeholder="Ask Penny anything…"
            rows={1}
            style={{
              flex: 1, border: 'none', outline: 'none', resize: 'none',
              fontSize: 14.5, lineHeight: 1.5, color: '#3D2E24',
              background: 'transparent', padding: '8px 0', maxHeight: 120,
              fontFamily: "'Geist', system-ui, sans-serif",
            }}
            onChange={e => {
              setInput(e.target.value);
              e.target.style.height = 'auto';
              e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
            }}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage(input);
              }
            }}
          />
          <button
            disabled={!canSend}
            onClick={() => sendMessage(input)}
            style={{
              width: 36, height: 36, borderRadius: '50%',
              border: 'none', cursor: canSend ? 'pointer' : 'default',
              background: canSend ? '#F08A6E' : '#E8DDD4',
              color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.2s', flexShrink: 0,
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M5 12l14-7-7 14-2-5-5-2z" fill="currentColor" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
