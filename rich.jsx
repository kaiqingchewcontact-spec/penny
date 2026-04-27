/* global React */
// ═════════════════════════════════════════════════════════════════
// Rich message components for the AI chat
// ═════════════════════════════════════════════════════════════════

const PALETTE = ['#FFB4A2', '#F8B4D9', '#C4B5FD', '#FFD166', '#9FD8B8', '#FFD8C7', '#A78BFA', '#FF7A7A'];

function RichHead({ icon, title, sub, tone = 'peach' }) {
  const tones = {
    peach: { bg: '#FFE3D6', fg: '#F08A6E' },
    pink: { bg: '#FCE0EE', fg: '#E879B5' },
    lav: { bg: '#ECE6FF', fg: '#8B73E8' },
    sun: { bg: '#FFEFC8', fg: '#F5B43A' },
    mint: { bg: '#DDF1E6', fg: '#4FB07F' },
  };
  const t = tones[tone] || tones.peach;
  return (
    <div className="rich-head">
      <div className="rh-icon" style={{ background: t.bg, color: t.fg }}>{icon}</div>
      <div className="rh-title">{title}</div>
      {sub && <div className="rh-sub">{sub}</div>}
    </div>
  );
}

// ─── KPI / hero number ───────────────────────────────────────────
function KpiCard({ label, value, delta, deltaDir = 'up' }) {
  return (
    <div className="kpi">
      <div className="label">{label}</div>
      <div className="value">{value}</div>
      {delta && (
        <div className={`delta ${deltaDir}`}>
          {deltaDir === 'up' ? '▲' : '▼'} {delta}
        </div>
      )}
    </div>
  );
}

// ─── Donut + legend (allocation) ─────────────────────────────────
function DonutChart({ data, size = 96, stroke = 16 }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  const r = (size - stroke) / 2;
  const cx = size / 2, cy = size / 2;
  const C = 2 * Math.PI * r;
  let acc = 0;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(-90deg)', flexShrink: 0 }}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#FFEFE4" strokeWidth={stroke} />
      {data.map((d, i) => {
        const frac = d.value / total;
        const dash = frac * C;
        const offset = -acc * C;
        acc += frac;
        return (
          <circle
            key={i}
            cx={cx} cy={cy} r={r} fill="none"
            stroke={d.color || PALETTE[i % PALETTE.length]}
            strokeWidth={stroke}
            strokeDasharray={`${dash} ${C - dash}`}
            strokeDashoffset={offset}
          />
        );
      })}
    </svg>
  );
}

function DonutBlock({ data, totalLabel, totalValue }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  return (
    <div className="donut-block">
      <div style={{ position: 'relative' }}>
        <DonutChart data={data} />
        {totalValue && (
          <div style={{
            position: 'absolute', inset: 0, display: 'grid', placeItems: 'center',
            textAlign: 'center', pointerEvents: 'none',
          }}>
            <div>
              <div style={{ fontSize: 9, color: '#8B7868', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' }}>{totalLabel}</div>
              <div style={{ fontFamily: 'Fraunces, serif', fontSize: 16, fontWeight: 500, lineHeight: 1 }}>{totalValue}</div>
            </div>
          </div>
        )}
      </div>
      <div className="legend">
        {data.map((d, i) => (
          <div key={i} className="legend-row">
            <div className="dot" style={{ background: d.color || PALETTE[i % PALETTE.length] }}></div>
            <div className="name">{d.name}</div>
            <div className="val">{d.label || ''}</div>
            <div className="pct">{Math.round((d.value / total) * 100)}%</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Bar chart (categories) ──────────────────────────────────────
function BarChart({ data, format = (v) => `$${v}` }) {
  const max = Math.max(...data.map(d => d.value));
  return (
    <div className="bars">
      {data.map((d, i) => (
        <div className="bar-row" key={i}>
          <div className="blabel">{d.label}</div>
          <div className="btrack">
            <div className="bfill" style={{
              width: `${(d.value / max) * 100}%`,
              background: d.color || PALETTE[i % PALETTE.length],
            }}></div>
          </div>
          <div className="bval">{format(d.value)}</div>
        </div>
      ))}
    </div>
  );
}

// ─── Line/area chart ─────────────────────────────────────────────
function LineChart({ points, w = 280, h = 110, color = '#F08A6E', fill = true, foot }) {
  if (!points || points.length < 2) return null;
  const min = Math.min(...points.map(p => p.y));
  const max = Math.max(...points.map(p => p.y));
  const range = max - min || 1;
  const pad = 8;
  const px = (i) => pad + (i / (points.length - 1)) * (w - 2 * pad);
  const py = (v) => h - pad - ((v - min) / range) * (h - 2 * pad);
  const path = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${px(i)} ${py(p.y)}`).join(' ');
  const area = `${path} L ${px(points.length - 1)} ${h} L ${px(0)} ${h} Z`;
  return (
    <div className="chart-wrap">
      <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" style={{ height: h }}>
        <defs>
          <linearGradient id={`lg-${color.slice(1)}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.35" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        {fill && <path d={area} fill={`url(#lg-${color.slice(1)})`} />}
        <path d={path} stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        {/* end dot */}
        <circle cx={px(points.length - 1)} cy={py(points[points.length - 1].y)} r="3.5" fill={color} stroke="#fff" strokeWidth="2" />
      </svg>
      {foot && (
        <div className="chart-foot">
          {foot.map((f, i) => <span key={i}>{f}</span>)}
        </div>
      )}
    </div>
  );
}

// ─── Transaction list ────────────────────────────────────────────
function TxnList({ items }) {
  return (
    <div className="txn-list">
      {items.map((t, i) => (
        <div className="txn-row" key={i}>
          <div className="ticon" style={{ background: t.tint || '#FFEFE4', color: t.fg || '#F08A6E' }}>
            {t.icon}
          </div>
          <div className="tmid">
            <div className="tname">{t.name}</div>
            <div className="tmeta">{t.meta}</div>
          </div>
          <div className={`tamt ${t.amount < 0 ? 'neg' : 'pos'}`}>
            {t.amount < 0 ? '−' : '+'}${Math.abs(t.amount).toLocaleString()}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Goal / budget progress ──────────────────────────────────────
function GoalCard({ name, current, target, currency = '$', accent = 'peach' }) {
  const pct = Math.min(100, Math.round((current / target) * 100));
  const grad = {
    peach: 'linear-gradient(90deg, #FFB4A2, #F8B4D9)',
    lav:   'linear-gradient(90deg, #C4B5FD, #F8B4D9)',
    mint:  'linear-gradient(90deg, #9FD8B8, #FFD166)',
    sun:   'linear-gradient(90deg, #FFD166, #FFB4A2)',
  }[accent];
  return (
    <div className="goal">
      <div className="goal-head">
        <div className="goal-name">{name}</div>
        <div className="goal-pct">{pct}%</div>
      </div>
      <div className="goal-track">
        <div className="goal-fill" style={{ width: `${pct}%`, background: grad }}></div>
      </div>
      <div className="goal-foot">
        <div><span className="v">{currency}{current.toLocaleString()}</span> saved</div>
        <div>of <span className="v">{currency}{target.toLocaleString()}</span></div>
      </div>
    </div>
  );
}

// ─── Comparison cards (two side by side) ─────────────────────────
function CompareCards({ left, right }) {
  const Col = ({ d }) => (
    <div className="col">
      <div className="ticker">{d.ticker}</div>
      <div className="name">{d.name}</div>
      <div className="price">{d.price}</div>
      <div className={`delta ${d.deltaDir}`}>{d.deltaDir === 'up' ? '▲' : '▼'} {d.delta}</div>
      {d.stats?.map((s, i) => (
        <div className="stat" key={i}><span>{s.k}</span><span>{s.v}</span></div>
      ))}
    </div>
  );
  return (
    <div className="compare">
      <Col d={left} />
      <Col d={right} />
    </div>
  );
}

// ─── Inline log-expense form ─────────────────────────────────────
function ExpenseForm({ defaults = {}, onSubmit, onCancel }) {
  const [amt, setAmt] = React.useState(defaults.amount || '');
  const [cat, setCat] = React.useState(defaults.category || 'Food & drink');
  const [note, setNote] = React.useState(defaults.note || '');
  const [date, setDate] = React.useState(defaults.date || 'Today');
  return (
    <div className="iform">
      <div className="row-h">
        <div className="field">
          <label>Amount</label>
          <input value={amt} onChange={e => setAmt(e.target.value)} placeholder="$0.00" inputMode="decimal" />
        </div>
        <div className="field">
          <label>Date</label>
          <select value={date} onChange={e => setDate(e.target.value)}>
            <option>Today</option>
            <option>Yesterday</option>
            <option>This week</option>
          </select>
        </div>
      </div>
      <div className="field">
        <label>Category</label>
        <select value={cat} onChange={e => setCat(e.target.value)}>
          <option>Food & drink</option>
          <option>Groceries</option>
          <option>Transport</option>
          <option>Entertainment</option>
          <option>Bills</option>
          <option>Shopping</option>
        </select>
      </div>
      <div className="field">
        <label>Note (optional)</label>
        <input value={note} onChange={e => setNote(e.target.value)} placeholder="Coffee with Sam" />
      </div>
      <div className="actions">
        <button className="cancel" onClick={onCancel}>Cancel</button>
        <button className="save" onClick={() => onSubmit({ amt, cat, note, date })}>Save expense</button>
      </div>
    </div>
  );
}

// ─── Calculator (retirement) ─────────────────────────────────────
function RetireCalc() {
  const [age, setAge] = React.useState(40);
  const [retire, setRetire] = React.useState(60);
  const [save, setSave] = React.useState(2500);
  const [ret, setRet] = React.useState(6);
  const years = retire - age;
  const months = years * 12;
  const r = ret / 100 / 12;
  const fv = months > 0 ? save * ((Math.pow(1 + r, months) - 1) / r) * (1 + r) : 0;
  return (
    <div className="calc">
      <div className="calc-result">
        <div className="label">Projected at age {retire}</div>
        <div className="value">${Math.round(fv).toLocaleString()}</div>
        <div className="note">In today's dollars, before inflation. Numbers are illustrative.</div>
      </div>
      <Slider name="Years until retirement" val={`${years} yrs`} min={5} max={35} value={years}
        onChange={v => setRetire(age + Number(v))} />
      <Slider name="Monthly contribution" val={`$${save.toLocaleString()}`} min={500} max={10000} step={100} value={save}
        onChange={v => setSave(Number(v))} />
      <Slider name="Expected return" val={`${ret}%`} min={2} max={10} step={0.5} value={ret}
        onChange={v => setRet(Number(v))} />
    </div>
  );
}

function Slider({ name, val, min, max, step = 1, value, onChange }) {
  return (
    <div className="calc-slider">
      <div className="head"><div className="name">{name}</div><div className="val">{val}</div></div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={e => onChange(e.target.value)} />
    </div>
  );
}

// ─── Allocation recommendation (current vs proposed) ─────────────
function AllocCompare({ current, proposed }) {
  return (
    <div className="alloc-grid">
      <div className="alloc-side">
        <h5>Now</h5>
        <DonutChart data={current} size={76} stroke={12} />
        {current.map((d, i) => (
          <div className="alloc-row" key={i}>
            <div className="swatch" style={{ background: d.color }}></div>
            <div className="nm">{d.name}</div>
            <div className="pc">{d.value}%</div>
          </div>
        ))}
      </div>
      <div className="alloc-side">
        <h5>Could be</h5>
        <DonutChart data={proposed} size={76} stroke={12} />
        {proposed.map((d, i) => (
          <div className="alloc-row" key={i}>
            <div className="swatch" style={{ background: d.color }}></div>
            <div className="nm">{d.name}</div>
            <div className="pc">{d.value}%</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Quick-action footer for cards ───────────────────────────────
function RichFoot({ buttons }) {
  return (
    <div className="rich-foot">
      {buttons.map((b, i) => (
        <button key={i} onClick={b.onClick}>
          {b.em && <span className="em">{b.em}</span>} {b.label}
        </button>
      ))}
    </div>
  );
}

Object.assign(window, {
  RichHead, KpiCard, DonutChart, DonutBlock, BarChart, LineChart,
  TxnList, GoalCard, CompareCards, ExpenseForm, RetireCalc, AllocCompare,
  RichFoot,
});
