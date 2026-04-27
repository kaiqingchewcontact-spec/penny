/* global React, Mascot, MascotMini */
/* global RichHead, KpiCard, DonutBlock, BarChart, LineChart, TxnList, GoalCard, CompareCards, ExpenseForm, RetireCalc, AllocCompare, RichFoot */
/* global PENNY_FLOWS, PENNY_SUGGESTED, PENNY_QUICK_CHIPS, PENNY_GENERIC */
/* global AndroidDevice */
/* global TweaksPanel, useTweaks, TweakSection, TweakRadio, TweakToggle, TweakSlider, TweakColor */

// ═════════════════════════════════════════════════════════════════
// Penny — Finance helper chat. Mobile-first Android web app.
// ═════════════════════════════════════════════════════════════════

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "mascotInBubbles": true,
  "showDisclaimer": true,
  "accent": "peach",
  "density": "cozy",
  "showFrame": true
}/*EDITMODE-END*/;

// ─── Rich content renderer ───────────────────────────────────────
function RichBlock({ kind, ctx }) {
  switch (kind) {
    case 'profile': {
      return (
        <div>
          <RichHead icon="🌏" title="Your situation (sample)" sub="edit anytime" tone="lav" />
          <div style={{ padding: '8px 12px 12px', display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12.5 }}>
            <Line k="Age" v="40 / partner 38" />
            <Line k="Property #1 (own)" v="¥9.8M · Pudong, rented out" />
            <Line k="Property #2 (own)" v="¥6.4M · Jing'an, primary" />
            <Line k="Mortgage outstanding" v="¥3.2M @ 4.1%" />
            <Line k="Cash & deposits" v="¥850k" />
            <Line k="A-shares & funds" v="¥420k" />
            <Line k="Pension (社保)" v="¥180k accrued" />
            <Line k="Monthly take-home" v="¥58k household" highlight />
          </div>
        </div>
      );
    }
    case 'alloc': {
      const current = [
        { name: 'Shanghai property', value: 78, color: '#FFB4A2' },
        { name: 'Cash · RMB', value: 7,  color: '#FFD166' },
        { name: 'A-shares & funds', value: 4, color: '#C4B5FD' },
        { name: 'Pension (社保)', value: 2, color: '#9FD8B8' },
        { name: 'Property mortgage', value: -27 + 36, color: '#F8B4D9' }, // representational
      ].filter(d => d.value > 0);
      const proposed = [
        { name: 'Shanghai property', value: 55, color: '#FFB4A2' },
        { name: 'Global stocks (USD)', value: 18, color: '#C4B5FD' },
        { name: 'Asia ex-China stocks', value: 8, color: '#A78BFA' },
        { name: 'Bonds & MMF', value: 9, color: '#9FD8B8' },
        { name: 'Cash · RMB + USD', value: 7, color: '#FFD166' },
        { name: 'Pension (社保)', value: 3, color: '#F8B4D9' },
      ];
      return (
        <div>
          <RichHead icon="🧭" title="Allocation today vs. diversified" tone="peach" />
          <AllocCompare current={current} proposed={proposed} />
        </div>
      );
    }
    case 'glidepath': {
      const points = [
        { y: 78 }, { y: 75 }, { y: 70 }, { y: 65 }, { y: 60 }, { y: 55 },
      ];
      return (
        <div>
          <RichHead icon="📉" title="Property concentration over 3 years" sub="quarterly" tone="pink" />
          <LineChart points={points} color="#E879B5" foot={['Now', '6mo', '1yr', '2yr', '2.5yr', '3yr']} />
          <div style={{ padding: '4px 12px 12px', fontSize: 12, color: '#5C4A3D', lineHeight: 1.45 }}>
            By redirecting <b>~¥18k/month</b> of savings to global ETFs and bonds, your property concentration drops from <b>78% → 55%</b> in three years — without selling anything.
          </div>
        </div>
      );
    }
    case 'calc': {
      return (
        <div>
          <RichHead icon="🧮" title="Retirement projection" sub="play with sliders" tone="sun" />
          <RetireCalc />
        </div>
      );
    }
    case 'compare': {
      return (
        <div>
          <RichHead icon="📊" title="Two example global ETFs" sub="educational" tone="lav" />
          <CompareCards
            left={{
              ticker: 'VWRA',
              name: 'Vanguard FTSE All-World',
              price: '$132.41',
              delta: '0.8%', deltaDir: 'up',
              stats: [
                { k: 'TER', v: '0.22%' },
                { k: 'Currency', v: 'USD' },
                { k: 'Listed', v: 'LSE / HKEX' },
                { k: 'Holdings', v: '~3,700' },
              ],
            }}
            right={{
              ticker: '2800',
              name: 'Tracker Fund of HK',
              price: 'HK$24.18',
              delta: '0.3%', deltaDir: 'down',
              stats: [
                { k: 'TER', v: '0.10%' },
                { k: 'Currency', v: 'HKD' },
                { k: 'Listed', v: 'HKEX' },
                { k: 'Holdings', v: '~80 (Hang Seng)' },
              ],
            }}
          />
        </div>
      );
    }
    case 'coffee': {
      const items = [
        { icon: '☕', name: 'Manner Coffee', meta: 'Today · 3 visits', amount: -68, tint: '#FCE0EE', fg: '#E879B5' },
        { icon: '☕', name: 'Seesaw Coffee', meta: 'Yesterday', amount: -42, tint: '#FFE3D6', fg: '#F08A6E' },
        { icon: '☕', name: '% Arabica', meta: 'Apr 22', amount: -55, tint: '#ECE6FF', fg: '#8B73E8' },
        { icon: '🥐', name: 'Tim Hortons', meta: 'Apr 20 · with breakfast', amount: -78, tint: '#FFEFC8', fg: '#F5B43A' },
      ];
      return (
        <div>
          <div style={{ background: 'linear-gradient(160deg,#FFE3D6,#FCE0EE)', padding: '14px 14px 12px' }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#5C4A3D', letterSpacing: '0.04em', textTransform: 'uppercase' }}>Coffee · 30 days</div>
            <div style={{ fontFamily: 'Fraunces, serif', fontSize: 30, fontWeight: 500, lineHeight: 1.1, marginTop: 2 }}>¥486</div>
            <div style={{ fontSize: 12, color: '#5C4A3D', marginTop: 4 }}>
              <span style={{ color: '#FF7A7A', fontWeight: 600 }}>▲ 18%</span> vs. last month · 14 visits
            </div>
          </div>
          <BarChart data={[
            { label: 'Manner', value: 178, color: '#E879B5' },
            { label: 'Seesaw', value: 132, color: '#F08A6E' },
            { label: '% Arabica', value: 95, color: '#8B73E8' },
            { label: "Tim Ho's", value: 81, color: '#F5B43A' },
          ]} format={(v) => `¥${v}`} />
          <TxnList items={items} />
        </div>
      );
    }
    case 'expenseForm': {
      return (
        <div>
          <RichHead icon="✏️" title="Log expense" tone="sun" />
          <ExpenseForm
            onSubmit={(d) => ctx.onExpenseSubmit?.(d)}
            onCancel={() => ctx.onExpenseCancel?.()}
          />
        </div>
      );
    }
    case 'compareStocks': {
      return (
        <div>
          <RichHead icon="📈" title="TSLA · NVDA" sub="real-time" tone="lav" />
          <CompareCards
            left={{
              ticker: 'TSLA',
              name: 'Tesla, Inc.',
              price: '$281.43',
              delta: '2.1%', deltaDir: 'up',
              stats: [
                { k: 'P/E', v: '74.3' },
                { k: 'Mkt cap', v: '$895B' },
                { k: '52w range', v: '$138 – $299' },
                { k: '1Y return', v: '+12.4%' },
              ],
            }}
            right={{
              ticker: 'NVDA',
              name: 'NVIDIA Corp.',
              price: '$1,128.20',
              delta: '0.6%', deltaDir: 'down',
              stats: [
                { k: 'P/E', v: '67.8' },
                { k: 'Mkt cap', v: '$2.78T' },
                { k: '52w range', v: '$391 – $1,224' },
                { k: '1Y return', v: '+184%' },
              ],
            }}
          />
        </div>
      );
    }
    case 'goals': {
      return (
        <div>
          <RichHead icon="🎯" title="Active goals" sub="3" tone="mint" />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <GoalCard name="Emergency fund" current={32400} target={50000} accent="mint" currency="¥" />
            <div style={{ borderTop: '1px solid #F0E1D2' }} />
            <GoalCard name="Japan trip 🎌" current={18800} target={22000} accent="peach" currency="¥" />
            <div style={{ borderTop: '1px solid #F0E1D2' }} />
            <GoalCard name="House down payment" current={620000} target={1500000} accent="lav" currency="¥" />
          </div>
        </div>
      );
    }
    case 'afford': {
      return (
        <div>
          <RichHead icon="🏠" title="Afford check · ¥6.2M" tone="peach" />
          <div style={{ padding: '10px 12px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <Stat label="Down payment" value="¥3.10M" sub="50% · uses 92% of cash" />
            <Stat label="Loan amount" value="¥3.10M" sub="25 yr · 4.1%" />
            <Stat label="Monthly P&I" value="¥16,580" sub="vs. ¥58k income" />
            <Stat label="Debt-to-income" value="34%" sub="warn" tone="warn" />
          </div>
          <div style={{ borderTop: '1px solid #F0E1D2', padding: '10px 12px', fontSize: 12, color: '#5C4A3D' }}>
            <b>After purchase:</b> ~¥260k cash buffer · ~3.5 months expenses
          </div>
        </div>
      );
    }
    case 'expenseSaved': {
      const d = ctx.expense || {};
      return (
        <div>
          <RichHead icon="✓" title="Expense saved" tone="mint" />
          <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div style={{ fontFamily: 'Fraunces, serif', fontSize: 26, fontWeight: 500 }}>
              {d.amt?.startsWith?.('$') ? d.amt : `$${d.amt || '0'}`}
            </div>
            <div style={{ fontSize: 12, color: '#5C4A3D' }}>
              {d.cat} · {d.date} {d.note && `· ${d.note}`}
            </div>
          </div>
        </div>
      );
    }
    default:
      return <div style={{ padding: 12, fontSize: 12, color: '#8B7868' }}>[unknown card: {kind}]</div>;
  }
}

// Small helper components
function Line({ k, v, highlight }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between',
      padding: '5px 0',
      borderBottom: '1px dashed #F0E1D2',
      ...(highlight ? { background: '#FFEFE4', borderRadius: 8, padding: '6px 8px', borderBottom: 'none' } : {}),
    }}>
      <span style={{ color: '#8B7868', fontSize: 11.5 }}>{k}</span>
      <span style={{ fontFamily: 'Fraunces, serif', fontWeight: 500, fontSize: 13 }}>{v}</span>
    </div>
  );
}

function Stat({ label, value, sub, tone }) {
  const subColor = tone === 'warn' ? '#F5B43A' : '#8B7868';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      <div style={{ fontSize: 10.5, color: '#8B7868', fontWeight: 600, letterSpacing: '0.03em', textTransform: 'uppercase' }}>{label}</div>
      <div style={{ fontFamily: 'Fraunces, serif', fontSize: 19, fontWeight: 500, letterSpacing: '-0.01em' }}>{value}</div>
      {sub && <div style={{ fontSize: 10.5, color: subColor, fontWeight: tone === 'warn' ? 600 : 400 }}>{sub}</div>}
    </div>
  );
}

// ─── Single message ──────────────────────────────────────────────
function MessageRow({ msg, ctx }) {
  if (msg.role === 'user') {
    return (
      <div className="row user">
        <div className="bubble">{msg.text}</div>
      </div>
    );
  }
  if (msg.role === 'typing') {
    return (
      <div className="row ai">
        <div className="avatar"><img src="assets/penny-face-cut.png" alt="" /></div>
        <div className="bubble"><div className="typing"><div className="dot"></div><div className="dot"></div><div className="dot"></div></div></div>
      </div>
    );
  }
  // AI: may have multiple parts (text + rich), share one avatar
  return (
    <>
      {msg.parts.map((p, i) => (
        <div className="row ai" key={i}>
          <div className="avatar" style={i > 0 ? { visibility: 'hidden' } : undefined}>
            {ctx.mascotInBubbles && i === 0 ? <img src="assets/penny-face-cut.png" alt="" /> : null}
          </div>
          {p.type === 'text' ? (
            <div className="bubble" dangerouslySetInnerHTML={{ __html: renderMarkdown(p.body) }}></div>
          ) : (
            <div className="rich"><RichBlock kind={p.kind} ctx={ctx} /></div>
          )}
        </div>
      ))}
    </>
  );
}

// tiny safe-ish markdown: bold + line breaks
function renderMarkdown(s) {
  return s
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br/>');
}

// ─── Empty state ─────────────────────────────────────────────────
function EmptyState({ onPick, density }) {
  return (
    <div className="empty-state">
      <div className="empty-hero">
        <div className="empty-mascot"><Mascot size={124} /></div>
        <div className="empty-greeting">Hi, I'm <em>Penny</em>.<br />What's on your mind, money-wise?</div>
        <div className="empty-sub">Ask anything — track spending, plan for goals, talk through investing ideas. I learn as we chat.</div>
      </div>
      <div className="suggest-label">Try asking</div>
      <div className="suggest-grid">
        {PENNY_SUGGESTED.map((s, i) => (
          <button key={i} className="suggest-card" onClick={() => onPick(s.flow)}>
            <div className={`sc-icon ${s.tone}`}>{s.icon}</div>
            <div className="sc-title">{s.title}</div>
            <div className="sc-sub">{s.sub}</div>
          </button>
        ))}
      </div>
      <div className="empty-quick">
        {PENNY_QUICK_CHIPS.map((c, i) => (
          <button key={i} className="qb" onClick={() => onPick('generic', c)}>{c}</button>
        ))}
      </div>
    </div>
  );
}

// ─── Main Penny app ──────────────────────────────────────────────
function PennyApp() {
  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [messages, setMessages] = React.useState([]);
  const [input, setInput] = React.useState('');
  const [activeFlow, setActiveFlow] = React.useState(null); // {key, step}
  const [chips, setChips] = React.useState(null);
  const [typing, setTyping] = React.useState(false);
  const [expense, setExpense] = React.useState(null);
  const scrollRef = React.useRef(null);
  const inputRef = React.useRef(null);

  // Scroll to bottom on new messages
  React.useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, typing, chips]);

  // Helper: append messages with typing delay
  const appendAi = React.useCallback(async (msgs) => {
    setChips(null);
    for (const m of msgs) {
      setTyping(true);
      await sleep(700);
      setTyping(false);
      setMessages(prev => [...prev, m]);
      if (m.chips) setChips(m.chips);
      await sleep(220);
    }
  }, []);

  const runFlowStep = React.useCallback(async (flowKey, stepIdx, options = {}) => {
    const flow = PENNY_FLOWS[flowKey];
    if (!flow || !flow.steps[stepIdx]) return;
    const step = flow.steps[stepIdx];
    setActiveFlow({ key: flowKey, step: stepIdx });

    // Each step is an array of msgs. user messages go in immediately, ai through appendAi
    const aiQueue = [];
    for (const m of step) {
      if (m.role === 'user') {
        // skip the user message if it was already added by the click handler
        if (!options.skipUser) {
          setMessages(prev => [...prev, m]);
        }
      } else {
        aiQueue.push(m);
      }
    }
    await appendAi(aiQueue);
  }, [appendAi]);

  const startFlow = React.useCallback(async (flowKey, customText) => {
    const flow = PENNY_FLOWS[flowKey];
    setChips(null);
    if (flowKey === 'generic') {
      setMessages(prev => [...prev, me(customText)]);
      const reply = PENNY_GENERIC[Math.floor(Math.random() * PENNY_GENERIC.length)];
      await appendAi([ai([{ type: 'text', body: reply }])]);
      return;
    }
    setMessages(prev => [...prev, me(flow.initial)]);
    await runFlowStep(flowKey, 0, { skipUser: true });
  }, [appendAi, runFlowStep]);

  const onSubmit = async () => {
    const text = input.trim();
    if (!text) return;
    setInput('');
    inputRef.current?.style && (inputRef.current.style.height = 'auto');
    setMessages(prev => [...prev, me(text)]);
    setChips(null);
    // Heuristic flow matching
    const lc = text.toLowerCase();
    if (lc.includes('shanghai') || lc.includes('retire') || lc.includes('diversif')) {
      await runFlowStep('shanghai', 0, { skipUser: true });
    } else if (lc.includes('coffee')) {
      await runFlowStep('coffee', 0, { skipUser: true });
    } else if (lc.includes('log') && lc.includes('expense')) {
      await runFlowStep('log', 0, { skipUser: true });
    } else if (lc.includes('tsla') || lc.includes('nvda') || lc.includes('compare')) {
      await runFlowStep('compare', 0, { skipUser: true });
    } else if (lc.includes('goal')) {
      await runFlowStep('goals', 0, { skipUser: true });
    } else if (lc.includes('afford') || lc.includes('apartment')) {
      await runFlowStep('afford', 0, { skipUser: true });
    } else {
      const reply = PENNY_GENERIC[Math.floor(Math.random() * PENNY_GENERIC.length)];
      await appendAi([ai([{ type: 'text', body: reply }])]);
    }
  };

  const onChipClick = async (chip) => {
    if (!activeFlow) {
      // empty-state-style handling
      setChips(null);
      setMessages(prev => [...prev, me(chip.label)]);
      const reply = PENNY_GENERIC[0];
      await appendAi([ai([{ type: 'text', body: reply }])]);
      return;
    }
    const nextStep = activeFlow.step + 1;
    const flow = PENNY_FLOWS[activeFlow.key];
    if (flow && flow.steps[nextStep]) {
      await runFlowStep(activeFlow.key, nextStep);
    } else {
      setChips(null);
      setMessages(prev => [...prev, me(chip.label)]);
      const reply = "Got it — I'd want to keep going on this with real account data. For now, I'd note it down and we can pick this up later.";
      await appendAi([ai([{ type: 'text', body: reply }])]);
    }
  };

  // Expense form handlers — wired through ctx
  const ctx = {
    mascotInBubbles: tweaks.mascotInBubbles,
    expense,
    onExpenseSubmit: async (d) => {
      setExpense(d);
      setMessages(prev => [...prev, me(`Logged ${d.amt || '$0'} for ${d.cat}`)]);
      await appendAi([ai([
        { type: 'text', body: `Saved! Want me to update your ${d.cat.toLowerCase()} budget while we're here?` },
        { type: 'rich', kind: 'expenseSaved' },
      ], { chips: [{ label: 'Yes, show budget', primary: true }, { label: 'No thanks' }] })]);
    },
    onExpenseCancel: () => {
      setMessages(prev => [...prev, me('Never mind')]);
      appendAi([ai([{ type: 'text', body: "No worries — anytime." }])]);
    },
  };

  const isEmpty = messages.length === 0;
  const canSend = input.trim().length > 0;

  const app = (
    <div className="penny-app">
      <div className="app-top">
        <div className="brand">
          <div className="brand-mark"><img src="assets/penny-face-cut.png" alt="" /></div>
          <div>
            <div className="brand-name">Penny</div>
            <div className="brand-sub">your money buddy · online</div>
          </div>
        </div>
        <button className="iconbtn" aria-label="Menu" title="Menu">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
        </button>
      </div>

      {tweaks.showDisclaimer && (
        <div className="disclaimer">
          <b>Education, not advice.</b> Penny is an AI — double-check anything that matters. You're responsible for your decisions.
        </div>
      )}

      {isEmpty ? (
        <div className="chat-scroll" ref={scrollRef}>
          <EmptyState onPick={(flow, text) => startFlow(flow, text)} density={tweaks.density} />
        </div>
      ) : (
        <div className="chat-scroll" ref={scrollRef}>
          <div className="day-sep">Today</div>
          {messages.map(m => <MessageRow key={m.id} msg={m} ctx={ctx} />)}
          {typing && <MessageRow msg={{ role: 'typing', id: 't' }} ctx={ctx} />}
          {chips && !typing && (
            <div className="chips">
              {chips.map((c, i) => (
                <button key={i} className={c.primary ? 'primary' : ''} onClick={() => onChipClick(c)}>{c.label}</button>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="composer">
        <button className="plus" aria-label="Attach">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
        </button>
        <div className="input-wrap">
          <textarea
            ref={inputRef}
            value={input}
            placeholder="Ask Penny anything…"
            rows={1}
            onChange={(e) => {
              setInput(e.target.value);
              e.target.style.height = 'auto';
              e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                onSubmit();
              }
            }}
          />
          <button className={`send ${canSend ? 'active' : ''}`} disabled={!canSend} onClick={onSubmit} aria-label="Send">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M5 12l14-7-7 14-2-5-5-2z" fill="currentColor" />
            </svg>
          </button>
        </div>
        <button className="mic" aria-label="Voice">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <rect x="9" y="3" width="6" height="11" rx="3" stroke="currentColor" strokeWidth="2" />
            <path d="M5 11a7 7 0 0014 0M12 18v3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {tweaks.showFrame ? (
        <AndroidDevice width={412} height={892} title={undefined}>
          {app}
        </AndroidDevice>
      ) : (
        <div style={{ width: '100vw', height: '100vh' }}>{app}</div>
      )}

      <TweaksPanel title="Tweaks">
        <TweakSection title="Brand">
          <TweakToggle label="Show mascot in chat bubbles" value={tweaks.mascotInBubbles} onChange={v => setTweak('mascotInBubbles', v)} />
          <TweakToggle label="Show legal disclaimer strip" value={tweaks.showDisclaimer} onChange={v => setTweak('showDisclaimer', v)} />
        </TweakSection>
        <TweakSection title="Display">
          <TweakToggle label="Show Android device frame" value={tweaks.showFrame} onChange={v => setTweak('showFrame', v)} />
          <TweakRadio label="Density" value={tweaks.density} options={[{label:'Cozy', value:'cozy'},{label:'Compact', value:'compact'}]} onChange={v => setTweak('density', v)} />
        </TweakSection>
        <TweakSection title="Conversation">
          <TweakButton label="Reset chat" onClick={() => { setMessages([]); setChips(null); setActiveFlow(null); }} />
          <TweakButton label="Jump to Shanghai flow" onClick={async () => { setMessages([]); setChips(null); await sleep(50); startFlow('shanghai'); }} />
          <TweakButton label="Jump to log expense" onClick={async () => { setMessages([]); setChips(null); await sleep(50); startFlow('log'); }} />
        </TweakSection>
      </TweaksPanel>
    </>
  );
}

function TweakButton({ label, onClick }) {
  return (
    <button onClick={onClick} style={{
      width: '100%',
      padding: '8px 10px',
      borderRadius: 8,
      border: '1px solid rgba(255,255,255,0.15)',
      background: 'rgba(255,255,255,0.05)',
      color: 'inherit',
      fontFamily: 'inherit',
      fontSize: 12,
      cursor: 'pointer',
      textAlign: 'left',
    }}>{label}</button>
  );
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

// Compact density CSS
function applyDensity(d) {
  const root = document.documentElement;
  if (d === 'compact') {
    root.style.setProperty('--r-md', '12px');
  } else {
    root.style.removeProperty('--r-md');
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(<PennyApp />);
